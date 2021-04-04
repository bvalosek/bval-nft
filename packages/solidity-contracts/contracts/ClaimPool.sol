// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// gives payee a claim for amount to the token in the pool
struct TokenClaim {
  address payee;
  uint256 amount;
}

// a general pool of tokens that can be claimed by various payees. the pool is funded by directly transfering the correct ERC20
contract ClaimPool is AccessControlEnumerable {

  // grants ability to mint tokens
  bytes32 public constant CLAIM_GRANTER = keccak256("CLAIM_GRANTER");

  // whenever a new claim is added to the pool
  event AddClaim(address indexed payee, uint256 amount);

  // whenever an address claims their balance
  event Claim(address indexed claimer, uint256 amount);

  // individual claimable balances
  mapping (address => uint256) private _balances;

  // sep storage value to keep track of total outstanding claims
  uint256 private _outstandingClaims;

  // claimable token
  IERC20 private _token;

  constructor(IERC20 token) {
    address msgSender = _msgSender();

    // contract deployer gets roles
    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
    _setupRole(CLAIM_GRANTER, msgSender);

    _token = token;
  }

  // get total outstanding balance for an address
  function balanceOf(address owner) external view returns (uint256) {
    return _balances[owner];
  }

  // get total reserve of tokens in the pool
  function poolReserve() external view returns (uint256) {
    return _token.balanceOf(address(this));
  }

  // total amount of claims remaining
  function totalOutstandingClaims() external view returns (uint256) {
    return _outstandingClaims;
  }

  // claim up to the max balance for msg sender
  function claim() external returns (uint256) {
    address sender = msg.sender;

    // determine if the sender gets their full balance or just whatever we have
    // avail in the pool
    uint256 balance = _balances[sender];
    uint256 available = _token.balanceOf(address(this));
    uint256 claimable = balance > available ? available : balance;
    require(claimable > 0, "nothing to claim");

    // deduct from our storage and transfer
    _balances[sender] -= claimable;
    _outstandingClaims -= claimable;
    _token.transfer(sender, claimable);
    emit Claim(sender, claimable);

    return claimable;
  }

  // used to increase the balance of an address
  function addClaims(TokenClaim[] memory claims) external {
    require(hasRole(CLAIM_GRANTER, _msgSender()), "requires CLAIM_GRANTER");
    for (uint i = 0; i < claims.length; i++) {
      _addClaim(claims[i].payee, claims[i].amount);
    }
  }

  // increase the balance for a specific address
  function _addClaim(address payee, uint256 amount) internal {
    _balances[payee] += amount;
    _outstandingClaims += amount;
    emit AddClaim(payee, amount);
  }

}
