// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const TokenLockManager = artifacts.require('TokenLockManager');
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
  const lock = await TokenLockManager.new(nft.address);
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
const MAX_DEPLOYMENT_GAS = 2000000;
const MAX_MUTATION_GAS = 200000;

contract('NFTTokenFaucet', (accounts) => {
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
  describe('seeding', () => {
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
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token has been burnt');
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
    it('should increment token count', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      assert.equal(await faucet.tokenCount(), 1);
    });
  });
  describe('token views', () => {
    it('should return token information', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      const info = await faucet.tokenInfo(tokenId);
      assert.equal(info.tokenId, '560090546495223353507900328505153421583562422229593510008531217198667005953');
      assert.equal(info.balance, BN(1000 * 100));
      assert.equal(info.dailyRate, BN(1000));
      assert.equal(info.claimable.toString(), '0');
      assert.equal(info.isBurnt, false);
      assert.equal(info.owner, a1);
      assert.equal(info.seedTimestamp, '1616976000');
    });
    it('should still return token information for burned tokens', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      await nft.burn(tokenId);
      const info = await faucet.tokenInfo(tokenId);
      assert.equal(info.isBurnt, true);
    });
    it('should provide token ID by index', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      const id = await faucet.tokenIdAt(0);
      assert.equal(id, '560090546495223353507900328505153421583562422229593510008531217198667005953');
    });
    it('should revert if token id out of range', async () => {
      const [a1] = accounts;
      const { faucet } = await factory(a1);
      const task = faucet.tokenIdAt(0);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'out of range');
    });
  });
  describe('cleanup', () => {
    it('should return tokens after cleaning up a burnt nft', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft, token } = await factory(a1);
      const balanceBefore = await token.balanceOf(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      await nft.burn(tokenId);
      await faucet.cleanup(tokenId);
      const balanceAfter = await token.balanceOf(a1);
      assert.equal(balanceBefore.toString(), balanceAfter.toString());
    });
    it('should revert if not SEEDER', async () => {
      const [a1, a2] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      await nft.burn(tokenId);
      const task = faucet.cleanup(tokenId, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires SEEDER_ROLE');
    });
    it('should revert if token not burnt', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      const task = faucet.cleanup(tokenId);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token is not burnt');
    });
    it('should no longer manage the token after cleaning up', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100);
      await nft.burn(tokenId);
      await faucet.cleanup(tokenId);
      assert.equal(await faucet.tokenCount(), '0');
    });
  });
  describe('claiming', () => {
    it('should allow claiming', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      await faucet.claim(tokenId);
      const info = await faucet.tokenInfo(tokenId);
      assert.equal(info.balance, BN(100 * 1000 - 1000));
    });
    it('should allow claiming if approved', async () => {
      const [a1, a2] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft, token } = await factory(a1);
      await nft.approve(a2, tokenId);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      await faucet.claim(tokenId, { from: a2 });
      const info = await faucet.tokenInfo(tokenId);
      assert.equal(info.balance, BN(100 * 1000 - 1000));
      assert.equal(await token.balanceOf(a1), 0);
      assert.equal(await token.balanceOf(a2), BN(1000));
    });
    it('should allow claiming if approved for all', async () => {
      const [a1, a2] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, nft, token } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      await nft.setApprovalForAll(a2, true);
      await faucet.claim(tokenId, { from: a2 });
      const info = await faucet.tokenInfo(tokenId);
      assert.equal(info.balance, BN(100 * 1000 - 1000));
      assert.equal(await token.balanceOf(a1), 0);
      assert.equal(await token.balanceOf(a2), BN(1000));
    });
    it('should revert if nothing to claim', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2022-03-30'); // 1 year later
      await faucet.claim(tokenId);
      const task = faucet.claim(tokenId);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nothing to claim');
    });
    it('should revert if non owner attempts to claim', async () => {
      const [a1, a2] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      const task = faucet.claim(tokenId, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'not owner or approved');
    });
    it('should revert if token is locked', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, lock } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      await lock.lockToken(tokenId);
      const task = faucet.claim(tokenId);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token is locked');
      await setNetworkTime('2022-03-30'); // 1 year later
      await faucet.claim(tokenId);
      // doesnt revert
    });
    it('should only allow claiming what has generated', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet, token } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2022-03-29'); // 1 year later
      const balanceBefore = await token.balanceOf(a1);
      await faucet.claim(tokenId);
      const balanceAfter = await token.balanceOf(a1);
      assert.equal(balanceAfter.sub(balanceBefore), BN(1000 * 100));
      assert.equal((await faucet.reserveBalance()).toString(), '0');
    });
    it('should emit a Claim event', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2022-03-30'); // 1 year later
      const resp = await faucet.claim(tokenId);

      truffleAssert.eventEmitted(resp, 'Claim', (event) => {
        return (
          event.tokenId.toString() === '560090546495223353507900328505153421583562422229593510008531217198667005953' &&
          event.claimer === a1 &&
          event.amount.toString() === BN(1000 * 100).toString()
        );
      });
    });
    it('should reduce claimable following a claim', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later

      await faucet.claim(tokenId);
      {
        const info = await faucet.tokenInfo(tokenId);
        assert.equal(info.balance, BN(100 * 1000 - 1000 * 1));
        assert.equal(info.claimable, 0);
      }
    });
    it('should not allow claiming immediately after claiming', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2021-03-30'); // 1 day later
      await faucet.claim(tokenId);
      const task = faucet.claim(tokenId);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nothing to claim');
    });
    it('should properly handle partial claiming', async () => {
      const [a1] = accounts;
      const [tokenId] = TOKENS;
      const { faucet } = await factory(a1);
      await faucet.seed(tokenId, BN(1000), 100); // 1000 a day for 100 days
      await setNetworkTime('2022-03-30'); // 1 year later

      {
        const info = await faucet.tokenInfo(tokenId);
        assert.equal(info.balance, BN(100 * 1000 - 1000 * 0));
        assert.equal(info.claimable, BN(100 * 1000 - 1000 * 0));
      }

      await faucet.claim(tokenId, BN(1000));
      {
        const info = await faucet.tokenInfo(tokenId);
        assert.equal(info.balance, BN(100 * 1000 - 1000 * 1));
        assert.equal(info.claimable, BN(100 * 1000 - 1000 * 1));
      }

      await faucet.claim(tokenId, BN(1000));
      {
        const info = await faucet.tokenInfo(tokenId);
        assert.equal(info.balance, BN(100 * 1000 - 1000 * 2));
        assert.equal(info.claimable, BN(100 * 1000 - 1000 * 2));
      }

      await faucet.claim(tokenId, BN(1000 * 98));
      {
        const info = await faucet.tokenInfo(tokenId);
        assert.equal(info.balance, 0);
        assert.equal(info.claimable, 0);
      }
    });
  });
});
