// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const TokenLockManager = artifacts.require('TokenLockManagerV2');
const MockERC721 = artifacts.require('MockERC721');

// set the date of the local blockchain
const setNetworkTime = async (date) => {
  const timestamp = Math.round(new Date(date).getTime() / 1000);
  await timeMachine.advanceBlockAndSetTime(timestamp);
};

const factory = async () => {
  const nft = await MockERC721.new();
  const lock = await TokenLockManager.new();
  return { nft, lock };
};

// gas
const MAX_DEPLOYMENT_GAS = 400000;
const MAX_MUTATION_GAS = 50000;

contract.only('TokenLockManager', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const { lock } = await factory();
      let { gasUsed } = await web3.eth.getTransactionReceipt(lock.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
    it('should lock with less than target mutation gas', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      const resp = await lock.lockToken(nft.address, tokenId);
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('lock', resp.receipt.gasUsed);
    });
    it('should unlock with less than target mutation gas', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await lock.lockToken(nft.address, tokenId);
      const resp = await lock.unlockToken(nft.address, tokenId);
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('unlock', resp.receipt.gasUsed);
    });
  });
  describe('token locking', () => {
    it('should start tokens unlocked', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      assert.isFalse(await lock.isTokenLocked(nft.address, tokenId));
    });
    it('should return not locked for non-existing token', async () => {
      const { lock, nft } = await factory();
      assert.isFalse(await lock.isTokenLocked(nft.address, '123'));
    });
    it('should lock a token', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await lock.lockToken(nft.address, tokenId);
      assert.isTrue(await lock.isTokenLocked(nft.address, tokenId));
    });
    it('should automatically unlock after 30 days', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await setNetworkTime('2021-04-20');
      await lock.lockToken(nft.address, tokenId);
      await setNetworkTime('2021-05-19');
      assert.isTrue(await lock.isTokenLocked(nft.address, tokenId));
      await setNetworkTime('2021-05-20T00:01:00');
      assert.isFalse(await lock.isTokenLocked(nft.address, tokenId));
    });
    it('should unlock after 1 day after calling unlock()', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await setNetworkTime('2021-04-20');
      await lock.lockToken(nft.address, tokenId);
      await lock.unlockToken(nft.address, tokenId);
      assert.isTrue(await lock.isTokenLocked(nft.address, tokenId));
      await setNetworkTime('2021-04-20T23:00:00');
      assert.isFalse(await lock.isTokenLocked(nft.address, tokenId));
      await setNetworkTime('2021-04-21');
    });
    it('should not re-lock if unlocking an unlocked token', async () => {
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await lock.unlockToken(nft.address, tokenId);
      assert.isFalse(await lock.isTokenLocked(nft.address, tokenId));
    });
  });
  describe('access control', () => {
    it('should not allow locking unowned token', async () => {
      const [, a2] = accounts;
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      {
        const task = lock.lockToken(nft.address, tokenId, { from: a2 });
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'cannot manage token');
      }
      {
        const task = lock.unlockToken(nft.address, tokenId, { from: a2 });
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'cannot manage token');
      }
    });
    it('should allow an approved operator to lock / unlock token', async () => {
      const [, a2] = accounts;
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await nft.approve(a2, tokenId);
      await lock.lockToken(nft.address, tokenId, { from: a2 }); // doesnt throw
      assert.isTrue(await lock.isTokenLocked(nft.address, tokenId));
    });
    it('should allow an approved-for-all operator to lock / unlock token', async () => {
      const [, a2] = accounts;
      const { lock, nft } = await factory();
      const tokenId = '1';
      await nft.mint('1');
      await nft.setApprovalForAll(a2, true);
      await lock.lockToken(nft.address, tokenId, { from: a2 }); // doesnt throw
      assert.isTrue(await lock.isTokenLocked(nft.address, tokenId));
    });
  });
});
