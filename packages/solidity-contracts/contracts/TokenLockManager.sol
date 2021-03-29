// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

// required implementation api for token lock manager
interface ITokenLockManager {
  function tokenUnlocksAt(uint256 tokenId) external view returns (uint);
  function isTokenLocked(uint256 tokenId) external view returns (bool);
  function lockToken(uint256 tokenId) external returns (uint);
  function unlockToken(uint256 tokenId) external returns (uint);
}

// a token lock manager will handle the locking and unlocking of tokens
abstract contract TokenLockManager is ERC165, ITokenLockManager {

  // timestamp when a token should be considered unlocked
  mapping (uint256 => uint) private _tokenUnlockTime;

  // ---
  // Locking functionality
  // ---

  // the timestamp that a token unlocks at
  function tokenUnlocksAt(uint256 tokenId) override external view returns (uint) {
    return _tokenUnlockTime[tokenId];
  }

  // true if a token is currently locked
  function isTokenLocked(uint256 tokenId) override external view returns (bool) {
    return _tokenUnlockTime[tokenId] >= block.timestamp;
  }

  // lock a token for (up to) 30 days
  function _lockToken(uint256 tokenId) internal returns (uint) {
    uint unlockAt = block.timestamp + 30 days;
    _tokenUnlockTime[tokenId] = unlockAt;
    return unlockAt;
  }

  // unlock token (shorten unlock time down to 1 day at most)
  function _unlockToken(uint256 tokenId) internal returns (uint) {
    uint max = block.timestamp + 1 days;
    uint current = _tokenUnlockTime[tokenId];
    uint unlockAt = current > max ? max : current;
    _tokenUnlockTime[tokenId] = unlockAt;
    return unlockAt;
  }

  // ---
  // introspection
  // ---

  function supportsInterface(bytes4 interfaceId) override public view virtual returns (bool) {
    return interfaceId == type(ITokenLockManager).interfaceId || super.supportsInterface(interfaceId);
  }

}
