// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const MockTokenLockManager = artifacts.require('MockTokenLockManager');

// set the date of the local blockchain
const setNetworkTime = async (date) => {
  const timestamp = Math.round(new Date(date).getTime() / 1000);
  await timeMachine.advanceBlockAndSetTime(timestamp);
};

// helps keeps tests more consistent when messing with network time
let snapshotId;
beforeEach(async () => {
  const snapshot = await timeMachine.takeSnapshot();
  snapshotId = snapshot['result'];
});
afterEach(async () => {
  await timeMachine.revertToSnapshot(snapshotId);
});

contract('CoreERC721', (accounts) => {
  describe('erc165 checks', () => {
    it('should implement ERC-165', async () => {
      const instance = await MockTokenLockManager.new();
      assert.isTrue(await instance.supportsInterface('0x01ffc9a7'));
    });
    it('should implement ITokenLockManager', async () => {
      const instance = await MockTokenLockManager.new();
      assert.isTrue(await instance.supportsInterface('0x97d02854'));
    });
  });

  describe('token locking', () => {
    it('should start tokens unlocked', async () => {
      const instance = await MockTokenLockManager.new();
      const tokenId = 1;
      assert.isFalse(await instance.isTokenLocked(tokenId));
    });
    it('should lock a token', async () => {
      const instance = await MockTokenLockManager.new();
      const tokenId = 1;
      await instance.lockToken(tokenId);
      assert.isTrue(await instance.isTokenLocked(tokenId));
    });
    it('should automatically unlock after 30 days', async () => {
      const instance = await MockTokenLockManager.new();
      const tokenId = 1;
      await setNetworkTime('2021-01-01');
      await instance.lockToken(tokenId);
      assert.isTrue(await instance.isTokenLocked(tokenId));
      await setNetworkTime('2021-01-31T00:00:05'); /// 5s buffer to account for test lag
      assert.isFalse(await instance.isTokenLocked(tokenId));
    });
    it('should unlock after 1 day after calling unlock()', async () => {
      const instance = await MockTokenLockManager.new();
      const tokenId = 1;
      await setNetworkTime('2021-01-01');
      await instance.lockToken(tokenId);
      await instance.unlockToken(tokenId);
      await setNetworkTime('2021-01-02T00:00:05'); // 5s buffer to account for test lag
      assert.isFalse(await instance.isTokenLocked(tokenId));
    });
    it('should not re-lock if unlocking an unlocked token', async () => {
      const instance = await MockTokenLockManager.new();
      const tokenId = 1;
      await instance.unlockToken(tokenId);
      assert.isFalse(await instance.isTokenLocked(tokenId));
    });
  });
});
