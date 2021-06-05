// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const TokenLockManager = artifacts.require('TokenLockManager');
const BVAL721 = artifacts.require('BVAL721');

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

const factory = async () => {
  const nft = await BVAL721.new();
  const lock = await TokenLockManager.new(nft.address);
  await simpleMint(nft);
  return { nft, lock };
};

const TOKENS = [
  // token #1, sequence 1, minted 2021-03-29, 1000x output mult
  '0x013d00010001491b48a300010001010960096003e80000000000000000000001',
  // token #29, sequence 6, minted 2021-05-01, 1000x output mult
  '0x01aa00010006493c492e00010001010e100e1003e8000000000000000000001d',
];

// start a sequence and mint
const simpleMint = async (instance, tokenId = TOKENS[0], date = '2021-03-29') => {
  await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
  await instance.startSequence({ sequenceNumber: '6', name: 'name', description: 'desc', image: 'data' });
  await setNetworkTime(date);
  const res = await instance.mint({
    tokenId,
    metadataCIDs: ['cid'],
  });
  return res;
};

// gas
const MAX_DEPLOYMENT_GAS = 400000;
const MAX_MUTATION_GAS = 50000;

contract('TokenLockManager', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const { lock } = await factory();
      let { gasUsed } = await web3.eth.getTransactionReceipt(lock.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
    it('should lock with less than target mutation gas', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      const resp = await lock.lockToken(tokenId);
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('lock', resp.receipt.gasUsed);
    });
    it('should unlock with less than target mutation gas', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      await lock.lockToken(tokenId);
      const resp = await lock.unlockToken(tokenId);
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('unlock', resp.receipt.gasUsed);
    });
  });
  describe('erc165 checks', () => {
    it('should implement ERC-165', async () => {
      const { lock } = await factory();
      assert.isTrue(await lock.supportsInterface('0x01ffc9a7'));
    });
    it('should implement ITokenLockManager', async () => {
      const { lock } = await factory();
      assert.isTrue(await lock.supportsInterface('0x97d02854'));
    });
  });

  describe('token locking', () => {
    it('should start tokens unlocked', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      assert.isFalse(await lock.isTokenLocked(tokenId));
    });
    it('should lock a token', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      await lock.lockToken(tokenId);
      assert.isTrue(await lock.isTokenLocked(tokenId));
    });
    it('should automatically unlock after 30 days', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      await lock.lockToken(tokenId);
      assert.isTrue(await lock.isTokenLocked(tokenId));
      await setNetworkTime('2021-04-29T00:00:05'); // 5s buffer to account for test lag
      assert.isFalse(await lock.isTokenLocked(tokenId));
    });
    it('should unlock after 1 day after calling unlock()', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      await lock.lockToken(tokenId);
      await lock.unlockToken(tokenId);
      await setNetworkTime('2021-03-30T00:00:05'); // 5s buffer to account for test lag
      assert.isFalse(await lock.isTokenLocked(tokenId));
    });
    it('should not re-lock if unlocking an unlocked token', async () => {
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      await lock.unlockToken(tokenId);
      assert.isFalse(await lock.isTokenLocked(tokenId));
    });
  });
  describe('access control', () => {
    it('should not allow locking unowned token', async () => {
      const [, a2] = accounts;
      const { lock } = await factory();
      const tokenId = TOKENS[0];
      {
        const task = lock.lockToken(tokenId, { from: a2 });
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'cannot manage token');
      }
      {
        const task = lock.unlockToken(tokenId, { from: a2 });
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'cannot manage token');
      }
    });
    it('should allow an approved operator to lock / unlock token', async () => {
      const [, a2] = accounts;
      const { lock, nft } = await factory();
      const tokenId = TOKENS[0];
      await nft.approve(a2, tokenId);
      await lock.lockToken(tokenId, { from: a2 }); // doesnt throw
      assert.isTrue(await lock.isTokenLocked(tokenId));
    });
    it('should allow an approved-for-all operator to lock / unlock token', async () => {
      const [, a2] = accounts;
      const { lock, nft } = await factory();
      const tokenId = TOKENS[0];
      await nft.setApprovalForAll(a2, true);
      await lock.lockToken(tokenId, { from: a2 }); // doesnt throw
      assert.isTrue(await lock.isTokenLocked(tokenId));
    });
  });
});
