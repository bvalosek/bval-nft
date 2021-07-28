const truffleAssert = require('truffle-assertions');

const MockERC20 = artifacts.require('MockERC20');
const MockERC721 = artifacts.require('MockERC721');
const NFTTokenFaucetV2 = artifacts.require('NFTTokenFaucetV2');
const NFTTokenFaucetV3 = artifacts.require('NFTTokenFaucetV3');

const { BN, toWei, fromWei } = web3.utils;
const ZERO = '0x0000000000000000000000000000000000000000';
const INFINITY = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const factory = async () => {
  const token = await MockERC20.new();
  const nft = await MockERC721.new();
  const faucet = await NFTTokenFaucetV3.new(token.address, {
    seeder: ZERO,
    faucet: ZERO,
    nft: ZERO,
  });
  await token.approve(faucet.address, INFINITY);

  return { token, nft, faucet };
};

// gas
const MAX_DEPLOYMENT_GAS = 2500000;
const MAX_MUTATION_GAS = 250000;

contract.only('NFTTokenFaucetV3', (accounts) => {
  const [a1, a2, a3, a4, a5] = accounts;
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const { faucet } = await factory(a1);
      let { gasUsed } = await web3.eth.getTransactionReceipt(faucet.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
    it('should seed with less than target mutation gas', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      const resp = await faucet.seed({
        nft: nft.address,
        tokenId,
        seeder: a1,
        dailyRate: toWei('1000'),
        totalDays: 100,
      });
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('seed', resp.receipt.gasUsed);
    });
  });
  describe('seeding', () => {
    it('should revert if msg sender does not have SEEDER_ROLE', async () => {
      const { faucet, nft } = await factory();
      const tokenId = '1';
      await nft.mint(tokenId);

      const task = faucet.seed(
        {
          nft: nft.address,
          tokenId,
          seeder: a1,
          dailyRate: toWei('1000'),
          totalDays: 100,
        },
        { from: a2 }
      );

      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires SEEDER_ROLE');
    });
    it('should revert if token already seeded', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('200000'));
      await nft.mint('1');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      const task = faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token already seeded');
    });
    it('should revert if token burnt', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      await nft.burn('1');
      const task = faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'invalid token');
    });
    it('should deposit seed tokens into the contract reserve', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      const reserve = await token.balanceOf(faucet.address);
      assert.equal(reserve, toWei('100000'));
    });
    it('should increment token count', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      assert.equal(await faucet.managedTokenCount(), 0);
      await faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      assert.equal(await faucet.managedTokenCount(), 1);
    });
  });
  describe('token view', () => {
    it('should return token view', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, true);
      assert.equal(view.seeder, a3);
      assert.equal(view.operator, a1);
      assert.equal(view.dailyRate, toWei('1000'));
      assert.equal(view.isLegacyToken, false);
      assert.equal(view.balance, toWei('100000'));
      assert.equal(view.claimable, toWei('0'));

      assert.equal(view.seededAt, view.lastClaimAt);
    });
  });
});
