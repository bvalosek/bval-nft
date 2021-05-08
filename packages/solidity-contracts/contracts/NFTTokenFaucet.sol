// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./CoreERC20.sol";
import "./CoreERC721.sol";
import "./TokenLockManager.sol";
import "./TokenID.sol";


// mint ERC20s to allow NFTs to "generate" tokens over time, based on a
// mint-date encoded into the tokenID
contract NFTTokenFaucet is AccessControlEnumerable {
  using TokenID for uint256;

  // ERC-20 contract
  CoreERC20 private _token;

  // ERC-721 contract
  CoreERC721 private _nft;

  // lock contract
  ITokenLockManager private _lock;

  // mapping from tokens -> last claim timestamp
  mapping (uint256 => uint) private _lastClaim;

  // max amount per NFT that can be claimed
  uint256 private _maxClaimAllowed = 10_000 * 10 ** 18;

  // base tokens per day an NFT generates
  uint256 private _baseDailyRate = 3 * 10 ** 16; // 0.03

  constructor(CoreERC20 token, CoreERC721 nft, ITokenLockManager lock) {
    _token = token;
    _lock = lock;
    _nft = nft;

    // contract deployer gets roles
    address msgSender = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
  }

  // ---
  // Admin
  // ---

  function setBaseDailyRate(uint256 rate) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _baseDailyRate = rate;
  }

  function setMaxClaimAllowed(uint256 max) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _maxClaimAllowed = max;
  }

  // total amount currently staked within an NFT
  function tokenBalance(uint256 tokenId) public view returns (uint256) {
    require(_nft.ownerOf(tokenId) != address(0), "invalid token");
    uint256 claimable = _uncappedClaimable(tokenId);
    return claimable < _maxClaimAllowed ? claimable : _maxClaimAllowed;
  }

  // total claimable for a given NFT, ignoring max cap
  function _uncappedClaimable(uint256 tokenId) internal view returns (uint256) {
    uint256 mintedAt = tokenId.tokenMintTimestamp();
    uint256 lastClaimAt = _lastClaim[tokenId];
    uint256 claimFrom = lastClaimAt > 0 ? lastClaimAt : mintedAt;
    uint256 claimTime = block.timestamp - claimFrom;
    uint256 claimable = claimTime * _baseDailyRate * tokenId.tokenOutput() / 1 days;

    return claimable;
  }

}
