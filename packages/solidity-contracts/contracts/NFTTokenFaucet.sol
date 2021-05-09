// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./CoreERC20.sol";
import "./CoreERC721.sol";
import "./TokenLockManager.sol";
import "./TokenID.sol";

// a claim request entry
struct TokenClaim {
  uint256 tokenId;
  uint256 amount;
  address to;
  // basis points to reclaim back to the pool, eg 1000 = 10% reclaim
  uint16 reclaimBps;
}

// info about the config of the contract
struct FaucetConfig {
  uint256 maxClaimAllowed;
  uint256 baseDailyRate;
  uint16 minReclaimBps;
  ITokenLockManager lock;
}

// mint ERC20s to allow NFTs to "generate" tokens over time, based on a
// mint-date encoded into the tokenID
contract NFTTokenFaucet is AccessControlEnumerable {
  using TokenID for uint256;

  // grants ability to claim any generated tokens from the faucet
  bytes32 public constant CLAIMER_ROLE = keccak256("CLAIMER_ROLE");

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

  // require a min reclaim BPS for all claims
  uint16 private _minReclaimBps = 0;

  // a claim has occured
  event Claim(
    address indexed claimer,
    uint256 indexed tokenId,
    address indexed to,
    address tokenOwner,
    uint256 amount,
    uint16 reclaimBps);

  constructor(CoreERC20 token, CoreERC721 nft, ITokenLockManager lock) {
    _token = token;
    _lock = lock;
    _nft = nft;

    // contract deployer gets roles
    address msgSender = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
  }

  // get info about the contract
  function getFaucetConfig() external view returns (FaucetConfig memory) {
    return FaucetConfig({
      maxClaimAllowed: _maxClaimAllowed,
      baseDailyRate: _baseDailyRate,
      minReclaimBps: _minReclaimBps,
      lock: _lock
    });
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

  function setMinReclaimBps(uint16 min) external {
    require(min <= 10000, "invalid bps");
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _minReclaimBps = min;
  }

  function setLockManager(ITokenLockManager lock) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _lock = lock;
  }

  // ---
  // meat n potatoes
  // ---

  // total amount currently staked within an NFT
  function tokenBalance(uint256 tokenId) public view returns (uint256) {
    require(_nft.ownerOf(tokenId) != address(0), "invalid token");

    uint256 mintedAt = tokenId.tokenMintTimestamp();
    uint256 lastClaimAt = _lastClaim[tokenId];
    uint256 claimFrom = lastClaimAt > 0 ? lastClaimAt : mintedAt;
    uint256 secondsToClaim = block.timestamp - claimFrom;
    uint256 claimable = secondsToClaim * _baseDailyRate * tokenId.tokenOutput() / 1 days;

    return claimable < _maxClaimAllowed ? claimable : _maxClaimAllowed;
  }

  // total amount of currently staked tokens within all NFTs owned by `owner`
  function ownerBalance(address owner) public view returns (uint256) {
    uint count = _nft.balanceOf(owner);
    uint256 claimable = 0;
    for (uint i; i < count; i++) {
      uint256 tokenId = _nft.tokenOfOwnerByIndex(owner, i);
      claimable += tokenBalance(tokenId);
    }
    return claimable;
  }

  // how much of the reserve token is left in the contract
  function reserveBalance() external view returns (uint256) {
    return _token.balanceOf(address(this));
  }

  // harvest staked tokens
  function claim(TokenClaim[] memory claims) external {
    require(claims.length > 0, "no claims");
    address claimer = _msgSender();
    bool isReclaimer = hasRole(CLAIMER_ROLE, claimer);
    uint timestamp = block.timestamp;

    for (uint i = 0; i < claims.length; i++) {
      uint256 tokenId = claims[i].tokenId;
      uint256 amount = claims[i].amount;
      uint256 reclaimBps = claims[i].reclaimBps;
      address to = claims[i].to;
      address owner = _nft.ownerOf(tokenId);
      uint256 claimable = tokenBalance(tokenId);

      require(isReclaimer || owner == claimer, "not token owner nor CLAIMER");
      require(reclaimBps <= 10000, "invalid reclaimBps");
      require(reclaimBps >= _minReclaimBps, "reclaimBps too low");
      require(amount > 0 && amount <= _maxClaimAllowed, "invalid amount");
      require(amount <= claimable, "not enough claimable");

      // claim only as far up as we need to get our amount... basically "advances"
      // the lastClaim timestamp the exact amount needed to provide the amount
      uint256 ratePerSecond = _baseDailyRate * tokenId.tokenOutput() / 1 days;
      uint claimAt = timestamp - (claimable - amount) / ratePerSecond;

      _lastClaim[tokenId] = claimAt;

      // if reclaimBps == 10,000 == 100%, then we don't transfer anything at all
      if (reclaimBps < 10_000) {
        _token.transfer(to, amount * (10_000 - reclaimBps) / 10_000);
      }

      emit Claim(claimer, tokenId, to, owner, amount, uint16(reclaimBps));
    }
  }

}
