// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../TokenLockManager.sol";

contract MockTokenLockManager is TokenLockManager {

  function lockToken(uint256 tokenId) override external returns (uint) {
    return _lockToken(tokenId);
  }

  function unlockToken(uint256 tokenId) override external returns (uint) {
    return _unlockToken(tokenId);
  }

}
