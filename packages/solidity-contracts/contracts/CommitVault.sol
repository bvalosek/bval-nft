// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct VaultData {
  uint256 balance;
  uint256 rewards;
  uint256 commitsAt;
  uint256 lastRewardPerToken;
}

struct VaultView {
  uint256 balance;
  uint256 rewards;
  uint256 commitment;
  uint256 secondsUntilCommit;
  // uint256 claimableRewards;
  uint256 vestPeriodInDays;
  uint256 dailyRewardRate;
  uint256 totalStaked;
  uint256 remainingRewards;
}

contract CommitVault is AccessControlEnumerable {
  IERC20 private _stakeToken;
  IERC20 private _rewardToken;

  // how many seconds until a vault is fully committed
  uint256 private _vestPeriod = 60 days;

  // cumulative reward per token -- this number strictly increases and is
  // updated before every state change to accumulate the generated rewards
  uint256 private _rewardPerToken = 0;

  // last time RPT was updated
  uint256 private _lastUpdateTime = 0;

  // total reward tokens per second
  uint256 private _dailyRewardRate = 0;

  // stake vaults
  mapping (address => VaultData) private _vaults;

  constructor(address stakeToken, address rewardToken) {
    _stakeToken = IERC20(stakeToken);
    _rewardToken = IERC20(rewardToken);

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function getVaultView(address account) external view returns (VaultView memory) {
    VaultData memory vault = _vaults[account];
    return VaultView({
      balance: vault.balance,
      rewards: getRewards(account),
      commitment: getCommitment(account),
      secondsUntilCommit: block.timestamp < vault.commitsAt ? vault.commitsAt - block.timestamp : 0,
      dailyRewardRate: _dailyRewardRate,
      remainingRewards: _rewardToken.balanceOf(address(this)),
      totalStaked: _stakeToken.balanceOf(address(this)),
      vestPeriodInDays: _vestPeriod / 1 days
    });
  }

  function getVestPeriodInDays() external view returns (uint256) {
    return _vestPeriod / 1 days;
  }

  // seconds until an account's vault balance is fully committed
  function getTimeUntilFullyCommitted(address account) public view returns (uint256) {
    uint256 commitsAt = _vaults[account].commitsAt;

    // un-inited vault = full commit time remaining
    if (commitsAt == 0) {
      return _vestPeriod;
    }

    // how many seconds until the vault is fully committed
    uint256 remaining = block.timestamp < commitsAt ? commitsAt - block.timestamp : 0;

    // clamp to vest period
    return remaining <= _vestPeriod ? remaining : _vestPeriod;
  }

  // a 18-decimal value from 0-1 indicating current percentage of commitment
  function getCommitment(address account) public view returns (uint256) {
    uint256 remaining = getTimeUntilFullyCommitted(account);
    uint256 current = 1e18 * (_vestPeriod - remaining) / _vestPeriod;
    return current;
  }

  // get vault data for an account
  function getVault(address account) external view returns (VaultData memory) {
    return _vaults[account];
  }

  // get total generated rewards for a specific account (doesnt factor in early
  // withdraw penalty)
  function getRewards(address account) public view returns (uint256) {
    VaultData memory vault = _vaults[account];
    uint256 marginalReward = _rewardPerToken - vault.lastRewardPerToken;
    uint256 rewards = vault.balance * marginalReward + vault.rewards;
    return rewards;
  }

  // modify vest period
  function setVestPeriodInDays(uint period) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _vestPeriod = period * 1 days;
  }

  // modify reward rate
  function setDailyRewardRate(uint256 rate) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _updateRewardPerToken();
    _dailyRewardRate = rate;
  }

  // stake tokens in the contract
  function stake(uint256 amount) external {
    require(amount > 0, "Cannot stake 0");
    address msgSender = _msgSender();
    _flushVaultRewards(msgSender);
    VaultData memory vault = _vaults[msgSender];

    uint256 startBalance = vault.balance;
    uint256 nextBalance = startBalance + amount;

    // balance * commitment is invariant, solve for next commitment % and commit at time
    uint256 startCommitment = getCommitment(msgSender);
    uint256 nextCommitment = startBalance * startCommitment / nextBalance;
    uint256 nextTimeUntilCommit = (1e18 - nextCommitment) * _vestPeriod / 1e18;
    uint256 nextCommitAt = block.timestamp + nextTimeUntilCommit;

    // transfer stake token to vault
    vault.balance = nextBalance;
    vault.commitsAt = nextCommitAt;
    _vaults[msgSender] = vault;
    _stakeToken.transferFrom(msgSender, address(this), amount);
  }

  // withdraw staked tokens
  function withdraw(uint256 amount) public {
    require(amount > 0, "Cannot withdraw 0");
    address msgSender = _msgSender();
    _flushVaultRewards(msgSender);
    VaultData memory vault = _vaults[msgSender];

    uint256 startBalance = vault.balance;
    require(amount <= startBalance, "insufficient balance");
    uint256 nextBalance = startBalance - amount; // will revert on underflow with sol8.1

    // solve the invariant, ensure next commitment is clamped to 100%
    uint256 startCommitment = getCommitment(msgSender);
    uint256 nextCommitment = nextBalance == 0 ? 0 : startBalance * startCommitment / nextBalance;
    nextCommitment = nextCommitment > 1e18 ? 1e18 : nextCommitment;
    uint256 nextTimeUntilCommit = (1e18 - nextCommitment * _vestPeriod) / 1e18;
    uint256 nextCommitAt = block.timestamp + nextTimeUntilCommit;

    // transfer stake token to vault
    vault.balance = nextBalance;
    vault.commitsAt = nextCommitAt;
    _vaults[msgSender] = vault;
    _stakeToken.transfer(msgSender, amount);
  }

  function claim() public {
    address msgSender = _msgSender();
    _flushVaultRewards(msgSender);
    uint256 reward = _vaults[msgSender].rewards;
    require(reward > 0, "Cannot claim 0");

    _vaults[msgSender].rewards = 0;

    // if commitment is not 100%, slash the reward. slashed rewards get added
    // back to PTR
    uint256 slash = (1e18 - getCommitment(msgSender)) * reward / 1e18;
    uint256 totalStaked = _stakeToken.balanceOf(address(this));
    _rewardPerToken += totalStaked > 0 ? slash / totalStaked : 0;

    _rewardToken.transfer(msgSender, reward - slash);
  }

  function exit() external {
    withdraw(_vaults[_msgSender()].balance);
    claim();
  }

  // before any stake changes, dump into the PTR accumulator
  function _updateRewardPerToken() internal {
    uint256 totalStaked = _stakeToken.balanceOf(address(this));
    uint256 remainingRewards = _rewardToken.balanceOf(address(this));

    uint256 updateDuration = block.timestamp - _lastUpdateTime;
    uint256 accumulated = updateDuration * _dailyRewardRate / 1 days;
    uint256 toAdd = accumulated > remainingRewards ? remainingRewards : accumulated;

    _rewardPerToken += totalStaked > 0 ? toAdd / totalStaked : 0;
    _lastUpdateTime = block.timestamp;
  }

  // dump accumulated rewards to the account vault
  function _flushVaultRewards(address account) internal {
    _updateRewardPerToken();
    VaultData memory vault = _vaults[account];

    vault.rewards = getRewards(account);
    vault.lastRewardPerToken = _rewardPerToken;
    _vaults[account] = vault;
  }

}
