// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const MockTokenLockManager = artifacts.require('MockTokenLockManager');
const BVAL20 = artifacts.require('BVAL20');
const BVAL721 = artifacts.require('BVAL721');
const NFTTokenFaucetV2 = artifacts.require('NFTTokenFaucetV2');

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
  await setNetworkTime(date);
  const res = await instance.mint({
    tokenId,
    metadataCIDs: ['cid'],
  });
  return res;
};

const factory = async (account) => {
  const token = await BVAL20.new();
  const nft = await BVAL721.new();
  const lock = await MockTokenLockManager.new(nft.address);
  const faucet = await NFTTokenFaucetV2.new({ token: token.address, nft: nft.address, lock: lock.address });

  // so we can mint
  await nft.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
  await nft.startSequence({ sequenceNumber: '6', name: 'name', description: 'desc', image: 'data' });

  // add some tokens to the account and approve the faucet to spend them
  await token.mintTo(account, BN(100000));
  await token.approve(faucet.address, BN('1000000000000000000'), { from: account });
  await simpleMint(nft, TOKENS[0]);

  return { nft, token, lock, faucet };
};

// gas
const MAX_DEPLOYMENT_GAS = 1800000;
const MAX_MUTATION_GAS = 200000;

contract.only('NFTTokenFaucet', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const [a1] = accounts;
      const { faucet } = await factory(a1);
      let { gasUsed } = await web3.eth.getTransactionReceipt(faucet.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
    it('should seed with less than target mutation gas', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      const resp = await faucet.seed(tokenId, BN(1000), 100);

      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('seed', resp.receipt.gasUsed);
    });
    it('should claim with less than target mutation gas', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      await faucet.seed(tokenId, BN(1000), 100, 1);
      const resp = await faucet.claim(tokenId, BN(100000));

      assert.isBelow(resp.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('claim', resp.receipt.gasUsed);
    });
  });
  describe.only('seeding', () => {
    it('should revert if msg sender does not have SEEDER_ROLE', async () => {
      const [a1, a2] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      const task = faucet.seed(tokenId, BN(1000), 100, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires SEEDER_ROLE');
    });
    it('should revert if token already seeded', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      await faucet.seed(tokenId, BN(1000), 100);
      const task = faucet.seed(tokenId, BN(1000), 100);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token already seeded');
    });
    it('should revert if token burnt', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft } = await factory(a1);
      await nft.burn(tokenId);

      const task = faucet.seed(tokenId, BN(1000), 100);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nonexistent token');
    });
    it('should deposit seed tokens into the contract reserve', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      await faucet.seed(tokenId, BN(1000), 100);

      const reserve = await faucet.reserveBalance();
      assert.equal(reserve, BN(1000 * 100));
    });
    it('should emit a Seed event', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);

      const resp = await faucet.seed(tokenId, BN(1000), 100);
      truffleAssert.eventEmitted(resp, 'Seed', (event) => {
        return (
          event.tokenId.toString() === '560090546495223353507900328505153421583562422229593510008531217198667005953' &&
          event.rate.toString() === BN(1000) &&
          event.totalDays.toString() === '100'
        );
      });
    });
  });
});
