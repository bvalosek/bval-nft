const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const MockERC20 = artifacts.require('MockERC20');
const CommitVault = artifacts.require('CommitVault');

const factory = async () => {
  const token = await MockERC20.new();
  const reward = await MockERC20.new();
  const vault = await CommitVault.new(token.address, reward.address);
  await token.approve(vault.address, '0xffffffffffffffffffffffffffffffff');
  return { token, reward, vault };
};

// set the date of the local blockchain
const setNetworkTime = async (date) => {
  const timestamp = Math.round(new Date(date).getTime() / 1000);
  await timeMachine.advanceBlockAndSetTime(timestamp);
};

const getVaultView = async (vault, account) => {
  const resp = await vault.getVaultView(account);
  return {
    balance: parseFloat(fromWei(resp.balance)),
    rewards: parseFloat(fromWei(resp.rewards)),
    commitment: parseFloat(fromWei(resp.commitment)),
    secondsUntilCommit: Number(resp.secondsUntilCommit),
    dailyRewardRate: parseFloat(fromWei(resp.dailyRewardRate)),
    remainingRewards: parseFloat(fromWei(resp.remainingRewards)),
    totalStaked: parseFloat(fromWei(resp.totalStaked)),
    vestPeriodInDays: resp.vestPeriodInDays,
  };
};

const { BN, toWei, fromWei } = web3.utils;

contract.only('CommitVault', (accounts) => {
  describe('basics', () => {
    it('should return zero starting balance', async () => {
      const [a1] = accounts;
      const { vault } = await factory();
      const info = await vault.getVault(a1);
      assert.equal(info.balance, 0);
      assert.equal(info.rewards, 0);
    });
    it('should return zero starting commitment', async () => {
      const [a1] = accounts;
      const { vault } = await factory();
      assert.equal(await vault.getCommitment(a1), 0);
    });
    it('should return full vest perioid on un-inited vault', async () => {
      const [a1] = accounts;
      const { vault } = await factory();
      assert.equal(await vault.getTimeUntilFullyCommitted(a1), 60 * 60 * 24 * 60);
    });
  });
  describe('admin', () => {
    it('should allow admin to change period', async () => {
      const { vault } = await factory();
      await vault.setVestPeriodInDays(10);
      assert.equal(await vault.getVestPeriodInDays(), 10);
    });
    it('should revert if not admin', async () => {
      const [, a2] = accounts;
      const { vault } = await factory();
      const task = vault.setVestPeriodInDays(10, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
  });
  describe('commitment', () => {
    it('should be at 50% half way through the vesting period', async () => {
      const [a1] = accounts;
      const { vault, token } = await factory();
      await vault.setVestPeriodInDays(10);
      await token.mint(toWei('100'));

      await setNetworkTime('2021-07-11');
      await vault.stake(toWei('100'));
      {
        const commitment = await vault.getCommitment(a1);
        assert.equal(parseFloat(fromWei(commitment)), 0);
      }

      await setNetworkTime('2021-07-16');
      {
        const commitment = await vault.getCommitment(a1);
        assert.equal(parseFloat(fromWei(commitment)), 0.5);
      }

      await setNetworkTime('2021-07-21'); // done
      {
        const commitment = await vault.getCommitment(a1);
        assert.equal(parseFloat(fromWei(commitment)), 1);
      }

      await setNetworkTime('2021-07-25'); // no longer increasing
      {
        const commitment = await vault.getCommitment(a1);
        assert.equal(parseFloat(fromWei(commitment)), 1);
      }
    });
    it('doubling deposit thats fully committed should reset commitment to 50%', async () => {
      const [a1] = accounts;
      const { vault, token } = await factory();
      await vault.setVestPeriodInDays(10);
      await token.mint(toWei('200'));

      // init
      await setNetworkTime('2021-07-11');
      await vault.stake(toWei('100'));
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0);

      // fully vested
      await setNetworkTime('2021-07-21');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);

      // resets on new stake
      await vault.stake(toWei('100'));
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0.5);

      // fully vested 5 days later
      await setNetworkTime('2021-07-26');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);
    });
    it('10xing deposit thats fully committed should reset commitment to 10%', async () => {
      const [a1] = accounts;
      const { vault, token } = await factory();
      await vault.setVestPeriodInDays(10);
      await token.mint(toWei('200'));

      // init
      await setNetworkTime('2021-07-11');
      await vault.stake(toWei('10'));
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0);

      // fully vested
      await setNetworkTime('2021-07-21');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);

      // resets on new stake
      await vault.stake(toWei('90'));
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0.1);

      // fully vested 9 days later
      await setNetworkTime('2021-07-30');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);
    });
    it('should bump commitment to 100% on withdrawing half of a 50% committed stake', async () => {
      const [a1] = accounts;
      const { vault, token } = await factory();
      await vault.setVestPeriodInDays(10);
      await token.mint(toWei('100'));

      // init
      await setNetworkTime('2021-07-11');
      await vault.stake(toWei('10'));
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0);

      // 50%
      await setNetworkTime('2021-07-16');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 0.5);

      // withdraw, commitment to 100% now
      await vault.withdraw(toWei('10'));
      await setNetworkTime('2021-07-16T00:00:10');
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);
      await setNetworkTime('2021-07-26'); // sanity check
      assert.equal(parseFloat(fromWei(await vault.getCommitment(a1))), 1);
    });
  });
  describe('staking', () => {
    it('should allow staking and withdrawing', async () => {
      const [a1] = accounts;
      const { vault, token } = await factory();
      await token.mint(toWei('100'));
      await vault.stake(toWei('100'));
      {
        const info = await vault.getVault(a1);
        assert.equal(info.balance, toWei('100'));
        assert.equal(await token.balanceOf(a1), 0);
        assert.equal(await token.balanceOf(vault.address), toWei('100'));
      }
      await vault.withdraw(toWei('100'));
      {
        const info = await vault.getVault(a1);
        assert.equal(info.balance, 0);
        assert.equal(await token.balanceOf(a1), toWei('100'));
        assert.equal(await token.balanceOf(vault.address), 0);
      }
    });
    it('should not allow withdrawing more than staked', async () => {
      const [, a2] = accounts;
      const { vault, token } = await factory();

      await token.mint(toWei('100'));
      await vault.stake(toWei('100'));
      await token.mint(toWei('50'), { from: a2 });
      await token.approve(vault.address, '0xffffffffffffffffffffffffffffffff', { from: a2 });
      await vault.stake(toWei('50'), { from: a2 });

      // sanity check
      assert.equal(await token.balanceOf(vault.address), toWei('150'));

      {
        const task = vault.withdraw(toWei('150'));
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'insufficient');
      }

      {
        const task = vault.withdraw(toWei('100'), { from: a2 });
        await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'insufficient');
      }

      // no reverts
      await vault.withdraw(toWei('100'));
      await vault.withdraw(toWei('50'), { from: a2 });
    });
  });
  describe.only('rewards', () => {
    it('should tap out reward and chill', async () => {
      const [a1, a2] = accounts;
      const { vault, token, reward } = await factory();

      await token.mint(toWei('100'));
      await token.mint(toWei('100'), { from: a2 });
      await reward.mint(toWei('1000'));
      await token.approve(vault.address, '0xffffffffffffffffffffffffffffffff', { from: a2 });

      // vests in 10 days, enough rewards for 10 days
      await setNetworkTime('2021-07-11');
      await vault.setVestPeriodInDays(10);
      await vault.setDailyRewardRate(toWei('100'));
      await reward.transfer(vault.address, toWei('1000'));
      await vault.stake(toWei('100'));
      // await vault.stake(toWei('100'), { from: a2 });

      console.log('pre', await getVaultView(vault, a1));

      await setNetworkTime('2021-07-25'); // well over 10 days
      console.log('before', await getVaultView(vault, a1));
      await vault.exit();
      console.log('after a1', await getVaultView(vault, a1));
      console.log('after a2', await getVaultView(vault, a2));
      // await vault.exit({ from: a2 });
      console.log('2 after a1', await getVaultView(vault, a1));
      console.log('2 after a2', await getVaultView(vault, a2));
      assert.equal(parseFloat(fromWei(await reward.balanceOf(a1))), 500);
      assert.equal(parseFloat(fromWei(await reward.balanceOf(a2))), 500);
    });
  });
});
