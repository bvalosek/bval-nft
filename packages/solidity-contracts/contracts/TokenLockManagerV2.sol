// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// a token lock manager will handle the locking and unlocking of tokens
// upgrades from V1 to work across multiple nft contracts
contract TokenLockManagerV2 {

  event Lock(
    IERC721 indexed nft,
    uint256 indexed tokenId,
    uint256 unlockAt
  );

  event Unlock(
    IERC721 indexed nft,
    uint256 indexed tokenId,
    uint256 unlockAt
  );

  // timestamp when a token should be considered unlocked
  mapping(IERC721 => mapping (uint256 => uint)) private _tokenUnlockTime;

  // ---
  // Locking functionality
  // ---

  // lock a token for (up to) 30 days
  function lockToken(IERC721 nft, uint256 tokenId) external {
    require(_isApprovedOrOwner(nft, tokenId, msg.sender), "cannot manage token");

    uint unlockAt = block.timestamp + 30 days;
    _tokenUnlockTime[nft][tokenId] = unlockAt;

    emit Lock(nft, tokenId, unlockAt);
  }

  // unlock token (shorten unlock time down to 1 day at most)
  function unlockToken(IERC721 nft, uint256 tokenId) external {
    require(_isApprovedOrOwner(nft, tokenId, msg.sender), "cannot manage token");

    uint max = block.timestamp + 1 days;
    uint current = _tokenUnlockTime[nft][tokenId];
    uint unlockAt = current > max ? max : current;
    _tokenUnlockTime[nft][tokenId] = unlockAt;

    emit Unlock(nft, tokenId, unlockAt);
  }

  // ---
  // views
  // ---

  // the timestamp that a token unlocks at
  function tokenUnlocksAt(IERC721 nft, uint256 tokenId) external view returns (uint) {
    return _tokenUnlockTime[nft][tokenId];
  }

  // true if a token is currently locked
  function isTokenLocked(IERC721 nft, uint256 tokenId) external view returns (bool) {
    return _tokenUnlockTime[nft][tokenId] >= block.timestamp;
  }

  // ---
  // utils
  // ---

  // returns true if operator can manage tokenId
  function _isApprovedOrOwner(IERC721 nft, uint256 tokenId, address operator) internal view returns (bool) {
    address owner = nft.ownerOf(tokenId);
    return owner == operator
      || nft.getApproved(tokenId) == operator
      || nft.isApprovedForAll(owner, operator);
  }

}
