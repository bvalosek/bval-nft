// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');
const { isAssertionExpression } = require('typescript');

const MockTokenLockManager = artifacts.require('MockTokenLockManager');
const BVAL20 = artifacts.require('BVAL20');
const BVAL721 = artifacts.require('BVAL721');
const NFTTokenFaucet = artifacts.require('NFTTokenFaucet');

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

const TOKENS = [
  // token #1, sequence 1, minted 2021-03-29, 1000x output mult
  '0x013d00010001491b48a300010001010960096003e80000000000000000000001',
];

// start a sequence and mint
const simpleMint = async (instance, tokenId = TOKENS[0], date = '2021-03-29') => {
  await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
  await setNetworkTime(date);
  const res = await instance.mint({
    tokenId,
    metadataCIDs: ['cid'],
  });
  return res;
};

const factory = async () => {
  const nft = await BVAL721.new();
  const token = await BVAL20.new();
  const lock = await MockTokenLockManager.new();
  const faucet = await NFTTokenFaucet.new(token.address, nft.address, lock.address);
  await faucet.setBaseDailyRate(1); // token has a 1000x multiplier
  await faucet.setMaxClaimAllowed(10000);
  return { nft, token, lock, faucet };
};

contract.only('NFTTokenFaucet', (accounts) => {
  describe('basic funcionality', () => {
    it('should return a balance for minted tokens', async () => {
      const { nft, faucet } = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(nft, tokenId);
      await setNetworkTime('2021-03-30'); // 1 day later
      const resp = await faucet.tokenBalance(tokenId);
      console.log(resp.toNumber());
      assert.equal(resp, 1000);
    });
    it('should return max allowed balance if token has mined max', async () => {
      const { nft, faucet } = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(nft, tokenId);
      await setNetworkTime('2022-03-29'); // 1 year later
      const resp = await faucet.tokenBalance(tokenId);
      assert.equal(resp, 10000);
    });
  });
});
