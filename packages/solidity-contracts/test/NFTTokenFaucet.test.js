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

// lol... just want a large number so we dont underflow during division
const BN = (amount) => `${amount}000000000000000000`;

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

const factory = async () => {
  const nft = await BVAL721.new();
  const token = await BVAL20.new();
  const lock = await MockTokenLockManager.new();
  const faucet = await NFTTokenFaucet.new(token.address, nft.address, lock.address);
  await faucet.setBaseDailyRate(BN(1)); // token has a 1000x multiplier
  await faucet.setMaxClaimAllowed(BN(10000));
  return { nft, token, lock, faucet };
};

// gas
const MAX_DEPLOYMENT_GAS = 1500000;
const MAX_MUTATION_GAS = 100000;

contract.only('NFTTokenFaucet', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const { faucet } = await factory();
      let { gasUsed } = await web3.eth.getTransactionReceipt(faucet.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
    it('should claim with less than target mutation gas', async () => {
      const [a1] = accounts;
      const tokenId = TOKENS[0];
      const { nft, faucet, token } = await factory();

      await token.mintTo(faucet.address, BN(100000));
      await simpleMint(nft, tokenId);

      await setNetworkTime('2021-03-30'); // 1 day later
      const resp = await faucet.claim([{ tokenId, amount: BN(1000), to: a1, reclaimBps: 0 }]);
      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('claim', resp.receipt.gasUsed);
    });
  });
  describe('tokenBalance', () => {
    it('should return a balance for minted tokens', async () => {
      const { nft, faucet } = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(nft, tokenId);
      assert.equal(await faucet.tokenBalance(tokenId), 0);

      await setNetworkTime('2021-03-30'); // 1 day later
      assert.equal(await faucet.tokenBalance(tokenId), BN(1000));

      await setNetworkTime('2021-03-31'); // 1 day later
      assert.equal(await faucet.tokenBalance(tokenId), BN(2000));
    });
    it('should return max allowed balance if token has mined max', async () => {
      const tokenId = TOKENS[0];
      const { nft, faucet } = await factory();

      await simpleMint(nft, tokenId);
      await setNetworkTime('2022-03-29'); // 1 year later
      assert.equal(await faucet.tokenBalance(tokenId), BN(10000));
    });
  });
  describe('ownerBalance', () => {
    it('should compute owner balance', async () => {
      const [a1] = accounts;
      const { nft, faucet } = await factory();
      const tokenId1 = TOKENS[0];
      const tokenId2 = TOKENS[1];
      await simpleMint(nft, tokenId1);

      await setNetworkTime('2021-05-01'); // token 2 mint date
      await nft.mint({ tokenId: tokenId2, metadataCIDs: ['cid'] });

      await setNetworkTime('2021-05-02'); // 1 day layer
      assert.equal(await faucet.ownerBalance(a1), BN(1000 + 10000 /* 1 day + max */));
    });
  });
  describe('claim', () => {
    it('should claim tokens', async () => {
      const [a1] = accounts;
      const tokenId = TOKENS[0];
      const { nft, faucet, token } = await factory();

      await token.mintTo(faucet.address, BN(100000));
      await simpleMint(nft, tokenId);

      await setNetworkTime('2021-03-30'); // 1 day later
      await faucet.claim([{ tokenId, amount: BN(1000), to: a1, reclaimBps: 0 }]);
      assert.equal(await token.balanceOf(a1), BN(1000));
      assert.equal(await faucet.tokenBalance(tokenId), 0);
      assert.equal(await faucet.reserveBalance(), BN(99000));

      await setNetworkTime('2021-03-31'); // 1 day later
      await faucet.claim([{ tokenId, amount: BN(1000), to: a1, reclaimBps: 0 }]);
      assert.equal(await token.balanceOf(a1), BN(2000));
      assert.equal(await faucet.tokenBalance(tokenId), 0);
      assert.equal(await faucet.reserveBalance(), BN(98000));
    });
    it('should factor in reclaim bps', async () => {
      const [a1] = accounts;
      const tokenId = TOKENS[0];
      const { nft, faucet, token } = await factory();

      await token.mintTo(faucet.address, BN(100000));
      await simpleMint(nft, tokenId);

      await setNetworkTime('2021-03-30'); // 1 day later
      await faucet.claim([{ tokenId, amount: BN(1000), to: a1, reclaimBps: 5000 /* 50% */ }]);
      assert.equal(await token.balanceOf(a1), BN(500));
      assert.equal(await faucet.tokenBalance(tokenId), 0); // token should be fully farmed out still
      assert.equal(await faucet.reserveBalance(), BN(99500) /* faucet balance decreased */);

      await setNetworkTime('2021-03-31'); // 1 day later
      await faucet.claim([{ tokenId, amount: BN(1000), to: a1, reclaimBps: 10000 /* 100% */ }]);
      assert.equal(await token.balanceOf(a1), BN(500));
      assert.equal(await faucet.tokenBalance(tokenId), 0); // token should be fully farmed out still
      assert.equal(await faucet.reserveBalance(), BN(99500) /* reserve balance not impacted */);
    });
  });
});
