// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./TokenLockManager.sol";


// initialization options for the faucet
struct FaucetOptions {
  IERC20 token;
  IERC721 nft;
  ITokenLockManager lock;
}

// view of token state
struct ManagedTokenInfo {
  uint256 tokenId;
  address owner;
  uint256 dailyRate;
  uint256 balance;
  uint256 claimable;
  uint lastClaimAt;
  bool isBurnt;
}

// Slightly different take on the NFT token faucet, this time requiring
// initializing every loaded NFT and JIT providing the ERC20 needed (eg, when
// using a 3P NFT contract/platform like screensaver.world)
contract NFTTokenFaucetV2 is AccessControlEnumerable {
  using EnumerableSet for EnumerableSet.UintSet;

  // grants ability to seed tokens
  bytes32 public constant SEEDER_ROLE = keccak256("SEEDER_ROLE");

  // grants ability to grant SEEDER_ROLE.
  bytes32 public constant SEEDER_ADMIN_ROLE = keccak256("SEEDER_ADMIN_ROLE");

  // ERC-20 contract
  IERC20 private _token;

  // ERC-721 contract
  IERC721 private _nft;

  // lock contract
  ITokenLockManager private _lock;

  // mapping from tokens -> last claim timestamp
  mapping (uint256 => uint) private _lastClaim;

  // mapping from tokens -> remaining balance
  mapping (uint256 => uint256) private _balances;

  // mapping from tokens -> daily rate
  mapping (uint256 => uint256) private _rates;

  // tokens this contract is managing
  EnumerableSet.UintSet private _tokens;

  // a claim has occured
  event Claim(
    uint256 indexed tokenId,
    address indexed claimer,
    uint256 amount);

  // a token was seeded
  event Seed(
    uint256 indexed tokenId,
    uint256 rate,
    uint256 totalDays);

  constructor(FaucetOptions memory options) {
    _token = options.token;
    _lock = options.lock;
    _nft = options.nft;

    // seeder role and admin role
    _setRoleAdmin(SEEDER_ADMIN_ROLE, SEEDER_ADMIN_ROLE);
    _setRoleAdmin(SEEDER_ROLE, SEEDER_ADMIN_ROLE);

    // contract deployer gets roles
    address msgSender = _msgSender();
    _setupRole(SEEDER_ADMIN_ROLE, msgSender);
    _setupRole(SEEDER_ROLE, msgSender);
  }

  // ---
  // iteration and views
  // ---

  // total count of managed tokens
  function tokenCount() external view returns (uint256) {
    return _tokens.length();
  }

  // get tokenId at an index
  function tokenIdAt(uint256 index) external view returns (uint256) {
    require(index < _tokens.length(), "index out of range");
    return _tokens.at(index);
  }

  // determine how many tokens are claimable for a specific NFT
  function claimable(uint256 tokenId) public view returns (uint256) {
    require(_tokens.contains(tokenId), "invalid token");
    uint256 balance = _balances[tokenId];
    uint256 claimFrom = _lastClaim[tokenId];
    uint256 secondsToClaim = block.timestamp - claimFrom;
    uint256 toClaim = secondsToClaim * _rates[tokenId] / 1 days;

    return toClaim > balance ? balance : toClaim;
  }

  // get info about a managed token
  function tokenInfo(uint256 tokenId) external view returns (ManagedTokenInfo memory) {
    require(_tokens.contains(tokenId), "invalid token");
    bool isBurnt = _isTokenBurnt(tokenId);
    return ManagedTokenInfo({
      tokenId: tokenId,
      owner: isBurnt ? address(0) : _nft.ownerOf(tokenId),
      dailyRate: _rates[tokenId],
      balance: _balances[tokenId],
      claimable: claimable(tokenId),
      lastClaimAt: _lastClaim[tokenId],
      isBurnt: _isTokenBurnt(tokenId)
    });
  }

  // ---
  // meat n potatoes
  // ---

  // how much of the reserve token is left in the contract
  function reserveBalance() external view returns (uint256) {
    return _token.balanceOf(address(this));
  }

  // seed an nft with the token
  function seed(uint256 tokenId, uint256 rate, uint256 totalDays, uint256 backdateDays) public {
    address msgSender = _msgSender();
    require(hasRole(SEEDER_ROLE, msgSender), "requires SEEDER_ROLE");
    require(!_tokens.contains(tokenId), "token already seeded");
    require(!_isTokenBurnt(tokenId), "token has been burnt");

    // take token from sender and stash in contract
    uint256 amount = totalDays * rate;
    _token.transferFrom(msgSender, address(this), amount);

    // set info for this token
    _tokens.add(tokenId);
    _balances[tokenId] = amount;
    _rates[tokenId] = rate;
    _lastClaim[tokenId] = block.timestamp - backdateDays * 1 days;

    emit Seed(tokenId, rate, totalDays);
  }

  // seed an nft with the token
  function seed(uint256 tokenId, uint256 rate, uint256 totalDays) external {
    return seed(tokenId, rate, totalDays, 0);
  }

  // claim all tokens inside an nft
  function claim(uint256 tokenId) external {
    return claim(tokenId, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
  }

  // take the generated tokens from an nft, up to amount
  function claim(uint256 tokenId, uint256 amount) public {
    address msgSender = _msgSender();
    address owner = _nft.ownerOf(tokenId);
    require(owner == msgSender, "not token owner");
    require(!_lock.isTokenLocked(tokenId), "token is locked");

    // compute how much we can claim, only pay attention to amount if its less
    // than available
    uint256 availableToClaim = claimable(tokenId);
    uint256 toClaim = amount < availableToClaim ? amount : availableToClaim;

    // update balances and execute ERC-20 transfer
    _balances[tokenId] -= toClaim;
    _token.transfer(msgSender, toClaim);

    emit Claim(tokenId, msgSender, toClaim);
  }

  // if an nft has been burned, allow rescuing all remaining ERC-20 tokens and
  // remove it from the list of managed nfts
  function cleanup(uint256 tokenId) external {
    address msgSender = _msgSender();
    require(hasRole(SEEDER_ROLE, msgSender), "requires SEEDER_ROLE");
    require(_balances[tokenId] != 0, "token has no balance");
    require(_isTokenBurnt(tokenId), "token is not burnt");

    // return remaining balance
    _token.transfer(msgSender, _balances[tokenId]);

    // clear
    _tokens.remove(tokenId);
    _balances[tokenId] = 0;
    _lastClaim[tokenId] = 0;
    _rates[tokenId] = 0;
  }

  // ---
  // utils
  // ---

  function _isTokenBurnt(uint256 tokenId) internal view returns (bool) {
    try _nft.ownerOf(tokenId) returns (address) {
      // if ownerOf didnt revert, then token is not burnt
      return false;
    } catch  {
      return true;
    }
  }

  // returns true if operator can manage tokenId
  function _isApprovedOrOwner(uint256 tokenId, address operator) internal view returns (bool) {
    address owner = _nft.ownerOf(tokenId);
    return owner == operator
      || _nft.getApproved(tokenId) == operator
      || _nft.isApprovedForAll(owner, operator);
  }

}
