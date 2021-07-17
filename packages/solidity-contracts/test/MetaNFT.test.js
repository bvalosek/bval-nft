const truffleAssert = require('truffle-assertions');

const MockERC20 = artifacts.require('MockERC20');
const MockMetadataResolver = artifacts.require('MockMetadataResolver');
const MetaNFT = artifacts.require('MetaNFT');

const factory = async (options = {}) => {
  const token = await MockERC20.new();
  const resolver = await MockMetadataResolver.new('default');
  const nft = await MetaNFT.new({
    name: 'Test NFT',
    symbol: 'TEST',
    token: token.address,
    defaultMetadataResolver: resolver.address,
    mintCost: 0,
    maxMints: 0,
    vips: [],
    ...options,
  });
  return { token, resolver, nft };
};

const { BN, toWei, fromWei } = web3.utils;

contract.only('MetaNFT', (accounts) => {
  const [a1, a2] = accounts;
  describe('vip stuff', () => {
    it('should allow a free VIP mint', async () => {
      const { nft } = await factory({ vips: [a1] });
      assert.equal(await nft.totalSupply(), 0);
      assert.equal(await nft.mintCountByAddress(a1), 0);
      await nft.mint();
      assert.equal(await nft.totalSupply(), 1);
      assert.equal(await nft.mintCountByAddress(a1), 1);
    });
    it('should not allow multiple VIP mints', async () => {
      const { nft } = await factory({ vips: [a1] });
      await nft.mint();
      const task = nft.mint();
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'max');
    });
    it('should not allow non-vip mints', async () => {
      const { nft } = await factory({ vips: [] });
      const task = nft.mint();
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'max');
    });
  });
  describe('mint data', () => {
    it('should indicate vip mint', async () => {
      const { nft } = await factory({ vips: [a1], maxMints: 2 });
      await nft.mint();
      await nft.mint();
      await nft.mint({ from: a2 });

      const info1 = await nft.mintData(1);
      assert.equal(info1.isVip, true);
      assert.equal(info1.isCredit, false);

      const info2 = await nft.mintData(2);
      assert.equal(info2.isVip, false);
      assert.equal(info2.isCredit, false);

      const info3 = await nft.mintData(3);
      assert.equal(info3.isVip, false);
      assert.equal(info3.isCredit, false);
    });
    it('should indicate credit mint', async () => {
      const { nft } = await factory({ maxMints: 2 });
      await nft.addCredits([{ account: a1, credits: 1 }]);
      await nft.mint();
      await nft.mint();
      await nft.mint({ from: a2 });

      const info1 = await nft.mintData(1);
      assert.equal(info1.isVip, false);
      assert.equal(info1.isCredit, true);

      const info2 = await nft.mintData(2);
      assert.equal(info2.isVip, false);
      assert.equal(info2.isCredit, false);

      const info3 = await nft.mintData(3);
      assert.equal(info3.isVip, false);
      assert.equal(info3.isCredit, false);
    });
  });
  describe('metadata', () => {
    it('should return default metadata', async () => {
      const { nft } = await factory({ vips: [a1] });
      await nft.mint();
      assert.equal(await nft.tokenURI(1), 'default');
    });
    it('should return modified metadata for token', async () => {
      const { nft } = await factory({ maxMints: 2 });
      await nft.mint(); // 1
      await nft.mint(); // 2
      assert.equal(await nft.tokenURI(1), 'default');
      assert.equal(await nft.tokenURI(2), 'default');

      const resolver = await MockMetadataResolver.new('modified');
      await nft.setMetadataResolver(2, resolver.address);
      assert.equal(await nft.tokenURI(1), 'default');
      assert.equal(await nft.tokenURI(2), 'modified');
    });
    it('should allow clearing resolver', async () => {
      const { nft } = await factory({ maxMints: 1 });
      await nft.mint(); // 1
      await nft.setMetadataResolver(1, '0x0000000000000000000000000000000000000000');
    });
    it('should not allow metadata config without CONFIG role', async () => {
      const { nft } = await factory({ maxMints: 1 });
      await nft.mint(); // 1
      const task = nft.setMetadataResolver(1, '0x0000000000000000000000000000000000000000', { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires CONFIG_ROLE');
    });
  });
  describe('admin', async () => {
    it('should not allow calling setMintCost without ADMIN role', async () => {
      const { nft } = await factory();
      const task = nft.setMintCost(1, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
    it('should not allow calling setMaxMints without ADMIN role', async () => {
      const { nft } = await factory();
      const task = nft.setMaxMints(1, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
    it('should not allow calling setDefaultMetadataResolver without ADMIN role', async () => {
      const { nft, resolver } = await factory();
      const task = nft.setDefaultMetadataResolver(resolver.address, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
    it('should not allow calling setToken without ADMIN role', async () => {
      const { nft, token } = await factory();
      const task = nft.setToken(token.address, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
    it('should not allow calling addCredits without ADMIN role', async () => {
      const { nft } = await factory();
      const task = nft.addCredits([], { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
  });
});
