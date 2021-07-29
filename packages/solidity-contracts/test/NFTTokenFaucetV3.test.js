const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const MockERC20 = artifacts.require('MockERC20');
const MockERC721 = artifacts.require('MockERC721');
const MockERC721NoMetadata = artifacts.require('MockERC721NoMetadata');
const NFTTokenFaucetV2 = artifacts.require('NFTTokenFaucetV2');
const NFTTokenFaucetV3 = artifacts.require('NFTTokenFaucetV3');
const TokenLockManagerV2 = artifacts.require('TokenLockManagerV2');

const { BN, toWei, fromWei } = web3.utils;
const ZERO = '0x0000000000000000000000000000000000000000';
const INFINITY = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// set the date of the local blockchain
const setNetworkTime = async (date) => {
  const timestamp = Math.round(new Date(date).getTime() / 1000);
  await timeMachine.advanceBlockAndSetTime(timestamp);
};

const factory = async () => {
  const token = await MockERC20.new();
  const nft = await MockERC721.new();
  const lock = await TokenLockManagerV2.new();
  const faucet = await NFTTokenFaucetV3.new({
    token: token.address,
    lock: lock.address,
    legacy: {
      seeder: ZERO,
      faucet: ZERO,
      nft: ZERO,
      lock: ZERO,
    },
  });
  await token.approve(faucet.address, INFINITY);

  return { token, nft, faucet, lock };
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
    it('should claim with less than target mutation gas', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a1, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      const resp = await faucet.claim(nft.address, tokenId, INFINITY);

      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('claim', resp.receipt.gasUsed);
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
    it('should emit a Seed event', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      const resp = await faucet.seed({
        nft: nft.address,
        tokenId,
        seeder: a2,
        dailyRate: toWei('1000'),
        totalDays: 100,
      });

      truffleAssert.eventEmitted(resp, 'Seed', (event) => {
        return (
          event.nft === nft.address &&
          event.tokenId.toString() === '1' &&
          event.seeder === a2 &&
          event.operator === a1 &&
          event.dailyRate.toString() === toWei('1000') &&
          event.totalDays.toNumber() === 100
        );
      });
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
      await nft.transferFrom(a1, a2, '1');
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, true);
      assert.equal(view.isSeeded, true);
      assert.equal(view.seeder, a3);
      assert.equal(view.operator, a1);
      assert.equal(view.dailyRate, toWei('1000'));
      assert.equal(view.isLegacyToken, false);
      assert.equal(view.balance, toWei('100000'));
      assert.equal(view.claimable, toWei('0'));
      assert.equal(view.owner, a2);
      assert.equal(view.unlocksAt, 0);
      assert.equal(view.tokenURI, 'uri');
      assert.equal(view.seededAt, view.lastClaimAt);
    });
    it('should still return token view for burned tokens', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await nft.burn('1');
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, false);
      assert.equal(view.isSeeded, true);
      assert.equal(view.tokenURI, 'uri');
      assert.equal(view.owner, ZERO);
      assert.equal(view.claimable, 0);
    });
    it('should still return token view for non-existing tokens', async () => {
      const tokenId = '1';
      const { faucet, nft } = await factory();
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, false);
      assert.equal(view.isSeeded, false);
      // assert.equal(view.tokenURI, ''); // mock contract returns URI regardless if token has been minted
      assert.equal(view.owner, ZERO);
      assert.equal(view.claimable, 0);
    });
    it('should still return token view for non-seeded tokens', async () => {
      const tokenId = '1';
      const { faucet, nft } = await factory();
      await nft.mint('1');
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, true);
      assert.equal(view.isSeeded, false);
      assert.equal(view.tokenURI, 'uri');
      assert.equal(view.owner, a1);
      assert.equal(view.claimable, 0);
    });
    it('should still return token view if tokenURI doesnt exist / fails', async () => {
      const tokenId = '1';
      const { faucet } = await factory();
      const nft = await MockERC721NoMetadata.new();
      await nft.mint('1');
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.nft, nft.address);
      assert.equal(view.tokenId, tokenId);
      assert.equal(view.isValidToken, true);
      assert.equal(view.isSeeded, false);
      assert.equal(view.owner, a1);
      assert.equal(view.claimable, 0);
      assert.equal(view.tokenURI, '');
    });
  });
  describe('claiming', () => {
    it('should allow claiming', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.balance, toWei('99000'));
      assert.equal(await token.balanceOf(a2), toWei('1000'));
    });
    it('should allow claiming if approved', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await nft.approve(a4, tokenId, { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a4 });
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.balance, toWei('99000'));
      assert.equal(await token.balanceOf(a4), toWei('1000'));
    });
    it('should allow claiming if approved for all', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await nft.setApprovalForAll(a4, true, { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a4 });
      const view = await faucet.getToken(nft.address, tokenId);
      assert.equal(view.balance, toWei('99000'));
      assert.equal(await token.balanceOf(a4), toWei('1000'));
    });
    it('should revert if nothing to claim', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2023-04-20');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      const task = faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nothing to claim');
    });
    it('should revert if non-owner attempts to claim', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      const task = faucet.claim(nft.address, tokenId, INFINITY, { from: a1 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'not owner or approved');
    });
    it('should revert if token is locked', async () => {
      const tokenId = '1';
      const { faucet, nft, token, lock } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await lock.lockToken(nft.address, tokenId, { from: a2 });
      const task = faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token locked');
    });
    it('only claim up to max balance', async () => {
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('200000'));
      await nft.mint('1', { from: a2 });
      await nft.mint('2', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId: '1', seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await faucet.seed({ nft: nft.address, tokenId: '2', seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2025-04-21');
      await faucet.claim(nft.address, '1', INFINITY, { from: a2 });
      const view = await faucet.getToken(nft.address, '1');
      assert.equal(view.balance, 0);
      assert.equal(await token.balanceOf(a2), toWei('100000'));
      assert.equal(await token.balanceOf(faucet.address), toWei('100000'));
    });
    it('should emit a Claim event', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2025-04-21');
      const resp = await faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });

      truffleAssert.eventEmitted(resp, 'Claim', (event) => {
        return (
          event.nft === nft.address &&
          event.tokenId.toString() === '1' &&
          event.claimer === a2 &&
          event.amount.toString() === toWei('100000')
        );
      });
    });
    it('should reduce claimable following a claim', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      const view = await faucet.getToken(nft.address, '1');
      assert.equal(view.balance, toWei('99000'));
      assert.equal(view.claimable, 0);
    });
    it('should not allow claiming immediately after claiming', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2021-04-21');
      await faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      const task = faucet.claim(nft.address, tokenId, INFINITY, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nothing to claim');
    });
    it('should properly handle partial claiming', async () => {
      const tokenId = '1';
      const { faucet, nft, token } = await factory();
      await token.mint(toWei('100000'));
      await nft.mint('1', { from: a2 });
      await setNetworkTime('2021-04-20');
      await faucet.seed({ nft: nft.address, tokenId, seeder: a3, dailyRate: toWei('1000'), totalDays: 100 });
      await setNetworkTime('2025-04-21');

      {
        const view = await faucet.getToken(nft.address, tokenId);
        assert.equal(view.balance, toWei('100000'));
        assert.equal(view.claimable, toWei('100000'));
      }

      await faucet.claim(nft.address, tokenId, toWei('1000'), { from: a2 });
      {
        const view = await faucet.getToken(nft.address, tokenId);
        assert.equal(view.balance, toWei('99000'));
        assert.equal(view.claimable, toWei('99000'));
      }

      await faucet.claim(nft.address, tokenId, toWei('1000'), { from: a2 });
      {
        const view = await faucet.getToken(nft.address, tokenId);
        assert.equal(view.balance, toWei('98000'));
        assert.equal(view.claimable, toWei('98000'));
      }

      await faucet.claim(nft.address, tokenId, toWei('98000'), { from: a2 });
      {
        const view = await faucet.getToken(nft.address, tokenId);
        assert.equal(view.balance, 0);
        assert.equal(view.claimable, 0);
      }
    });
  });
});
