// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// required implementation api for token lock manager
interface ITokenLockManager is IERC165 {
  function tokenUnlocksAt(uint256 tokenId) external view returns (uint);
  function isTokenLocked(uint256 tokenId) external view returns (bool);
  function lockToken(uint256 tokenId) external returns (uint);
  function unlockToken(uint256 tokenId) external returns (uint);
}

// a token lock manager will handle the locking and unlocking of tokens
contract TokenLockManager is ERC165, ITokenLockManager {

  // timestamp when a token should be considered unlocked
  mapping (uint256 => uint) private _tokenUnlockTime;

  // nft contract
  IERC721 private _nft;

  constructor(IERC721 nft) {
    _nft = nft;
  }

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
  function lockToken(uint256 tokenId) override external returns (uint) {
    require(_isApprovedOrOwner(tokenId, msg.sender), "cannot manage token");

    uint unlockAt = block.timestamp + 30 days;
    _tokenUnlockTime[tokenId] = unlockAt;

    return unlockAt;
  }

  // unlock token (shorten unlock time down to 1 day at most)
  function unlockToken(uint256 tokenId) override external returns (uint) {
    require(_isApprovedOrOwner(tokenId, msg.sender), "cannot manage token");

    uint max = block.timestamp + 1 days;
    uint current = _tokenUnlockTime[tokenId];
    uint unlockAt = current > max ? max : current;
    _tokenUnlockTime[tokenId] = unlockAt;

    return unlockAt;
  }

  // returns true if operator can manage tokenId
  function _isApprovedOrOwner(uint256 tokenId, address operator) internal view returns (bool) {
    address owner = _nft.ownerOf(tokenId);
    return owner == operator
      || _nft.getApproved(tokenId) == operator
      || _nft.isApprovedForAll(owner, operator);
  }

  // ---
  // introspection
  // ---

  function supportsInterface(bytes4 interfaceId) override(ERC165, IERC165) public view virtual returns (bool) {
    return interfaceId == type(ITokenLockManager).interfaceId || super.supportsInterface(interfaceId);
  }

}
