// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./NFTTokenFaucetV2.sol";
import "./TokenLockManagerV2.sol";

// data saved for-each token
struct TokenData {
  address seeder; // faucet v2 address for legacy tokens, else artist
  address operator; // msg.sender for seed operation
  uint256 seededAt;
  uint256 dailyRate;
  bool isLegacyToken; // true = using v2
  uint256 balance; // mutable
  uint256 lastClaimAt; // mutable
}

// query input for batch get token data
struct Token {
  IERC721 nft;
  uint256 tokenId;
}

// info provided when seeding a token
struct SeedInput {
  IERC721 nft;
  uint256 tokenId;
  address seeder;
  uint256 dailyRate;
  uint256 totalDays;
}

// data return for a single token
struct TokenView {
  // input
  IERC721 nft;
  uint256 tokenId;

  // external state
  bool isValidToken;
  uint256 unlocksAt;
  address owner;
  string tokenURI;

  // data
  address seeder;
  address operator;
  uint256 seededAt;
  uint256 dailyRate;
  bool isLegacyToken;
  uint256 balance;
  uint256 lastClaimAt;

  // state
  uint256 claimable;
  bool isSeeded;
}

// used to do legacy seeds
struct LegacyFaucetInput {
  address seeder;
  IERC721 nft;
  NFTTokenFaucetV2 faucet;
}

struct FaucetContractOptions {
  IERC20 token;
  TokenLockManagerV2 lock;
  LegacyFaucetInput legacy;
}

// Seed NFTs from any contract with tokens that are "mined" at a linear rate,
// claimable by the token owner.
//
// Provenance Minting litepaper:
// - https://docs.sickvibes.xyz/vibes-protocol/provenance-mining/protocol-thesis
//
// Upgrades V2 to allow for tracking the original seeder, operator, and working
// across multiple contracts
contract NFTTokenFaucetV3 is AccessControlEnumerable {
  using EnumerableSet for EnumerableSet.UintSet;

  // grants ability to seed tokens
  bytes32 public constant SEEDER_ROLE = keccak256("SEEDER_ROLE");

  // grants ability to grant SEEDER_ROLE.
  bytes32 public constant SEEDER_ADMIN_ROLE = keccak256("SEEDER_ADMIN_ROLE");

  // ERC-20 contract
  IERC20 public token;

  // token lock manager
  TokenLockManagerV2 public lock;

  // total managed tokens
  uint256 public managedTokenCount;

  // legacy tokens
  uint256 public legacyTokenCount;

  // contract -> tokenId -> data
  mapping (IERC721 => mapping (uint256 => TokenData)) private _tokenData;

    // a claim has occured
  event Claim(
    IERC721 indexed nft,
    uint256 indexed tokenId,
    address indexed claimer,
    uint256 amount);

  // a token was seeded
  event Seed(
    IERC721 indexed nft,
    uint256 indexed tokenId,
    address indexed seeder,
    address operator,
    uint256 seedTimestamp,
    uint256 dailyRate,
    uint256 totalDays);

  constructor(FaucetContractOptions memory options) {
    token = options.token;
    lock = options.lock;

    // seeder role and admin role
    _setRoleAdmin(SEEDER_ADMIN_ROLE, SEEDER_ADMIN_ROLE);
    _setRoleAdmin(SEEDER_ROLE, SEEDER_ADMIN_ROLE);

    // contract deployer gets roles
    _setupRole(SEEDER_ADMIN_ROLE, msg.sender);
    _setupRole(SEEDER_ROLE, msg.sender);

    if (options.legacy.faucet != NFTTokenFaucetV2(address(0))) {
      _legacySeed(options.legacy);
    }
  }

  // ---
  // seeding
  // ---

  function seed(SeedInput memory input) external {
    IERC721 nft = input.nft;
    uint256 tokenId = input.tokenId;
    require(hasRole(SEEDER_ROLE, msg.sender), "requires SEEDER_ROLE");
    require(_tokenData[nft][tokenId].operator == address(0), "token already seeded");
    require(_isTokenValid(nft, tokenId), "invalid token");

    uint256 totalDays = input.totalDays;
    uint256 dailyRate = input.dailyRate;
    address seeder = input.seeder;

    // take token from sender and stash in contract
    uint256 amount = totalDays * dailyRate;
    token.transferFrom(msg.sender, address(this), amount);

    _tokenData[nft][tokenId] = TokenData({
      seeder: seeder,
      operator: msg.sender,
      seededAt: block.timestamp,
      dailyRate: dailyRate,
      balance: amount,
      isLegacyToken: false,
      lastClaimAt: block.timestamp
    });

    managedTokenCount++;

    emit Seed(nft, tokenId, seeder, msg.sender, block.timestamp, dailyRate, totalDays);
  }

  // given a faucet v2 contract, add info to this contract for all managed tokens
  function _legacySeed(LegacyFaucetInput memory input) private {
    NFTTokenFaucetV2 faucet = input.faucet;
    IERC721 nft = input.nft;
    address seeder = input.seeder;
    uint256 count = faucet.tokenCount();

    for (uint256 i = 0; i < count; i++) {
      uint256 tokenId = faucet.tokenIdAt(i);
      require(_tokenData[nft][tokenId].operator == address(0), "token already seeded");
      ManagedTokenInfo memory legacyData = faucet.tokenInfo(tokenId);

      _tokenData[nft][tokenId] = TokenData({
        seeder: seeder,
        // since we have to resolve some of the below data JIT, stash the faucet
        // in the operator field of the struct so we can query the legacy
        // contract later
        operator: address(faucet),
        seededAt: legacyData.seedTimestamp,
        dailyRate: legacyData.dailyRate,
        isLegacyToken: true,

        // these values will have to be resolved JIT during queries
        balance: 0,
        lastClaimAt: 0
      });

      // using zero values for rate and total days as sentinels for legacy seeds
      emit Seed(nft, tokenId, seeder, address(faucet), legacyData.seedTimestamp, 0, 0);
    }

    legacyTokenCount += count;
  }

  // ---
  // claiming
  // ---

  // take the generated tokens from an nft, up to amount
  function claim(IERC721 nft, uint256 tokenId, uint256 amount) public {
    require(_isApprovedOrOwner(nft, tokenId, msg.sender), "not owner or approved");
    require(!lock.isTokenLocked(nft, tokenId), "token locked");

    // compute how much we can claim, only pay attention to amount if its less
    // than available
    uint256 availableToClaim = claimable(nft, tokenId); // throws here on legacy token
    uint256 toClaim = amount < availableToClaim ? amount : availableToClaim;
    require(toClaim > 0, "nothing to claim");

    TokenData memory data = _tokenData[nft][tokenId];

    // claim only as far up as we need to get our amount... basically "advances"
    // the lastClaim timestamp the exact amount needed to provide the amount
    // claim at = last + (to claim / rate) * 1 day, rewritten for div last
    uint256 claimAt = data.lastClaimAt + toClaim * 1 days / data.dailyRate;

    // update balances and execute ERC-20 transfer
    _tokenData[nft][tokenId].balance -= toClaim;
    _tokenData[nft][tokenId].lastClaimAt = claimAt;
    token.transfer(msg.sender, toClaim);

    emit Claim(nft, tokenId, msg.sender, toClaim);
  }

  // ---
  // views
  // ---

  // determine how many tokens are claimable for a specific NFT
  function claimable(IERC721 nft, uint256 tokenId) public view returns (uint256) {
    TokenData memory data = _tokenData[nft][tokenId];
    require(data.operator != address(0), "token not seeded");
    require(!data.isLegacyToken, "cannot claim from legacy token");
    require(_isTokenValid(nft, tokenId), "invalid token");

    uint256 balance = data.balance;
    uint256 lastClaimAt = data.lastClaimAt;
    uint256 secondsToClaim = block.timestamp - lastClaimAt;
    uint256 toClaim = secondsToClaim * data.dailyRate / 1 days;

    return toClaim > balance ? balance : toClaim;
  }

  // get token info. returns an empty struct (zero-inited) if not found
  function getToken(IERC721 nft, uint256 tokenId) public view returns (TokenView memory) {
    TokenData memory data = _tokenData[nft][tokenId];
    bool isValid = _isTokenValid(nft, tokenId);
    bool isSeeded = data.operator != address(0);

    TokenView memory tokenView = TokenView({
      nft: nft,
      tokenId: tokenId,
      isValidToken: isValid,
      isSeeded: isSeeded,
      tokenURI: _tokenURIOrEmpty(nft, tokenId),
      seeder: data.seeder,
      operator: data.operator,
      seededAt: data.seededAt,
      dailyRate: data.dailyRate,
      unlocksAt: lock.tokenUnlocksAt(nft, tokenId),
      owner: isValid ? nft.ownerOf(tokenId) : address(0),
      isLegacyToken: data.isLegacyToken,
      balance: data.balance,
      lastClaimAt: data.lastClaimAt,
      claimable: 0 // set below
    });

    // if its a legacy token, query the original contract for real-time info
    if (data.isLegacyToken) {
      ManagedTokenInfo memory legacyData = NFTTokenFaucetV2(data.operator).tokenInfo(tokenId);
      tokenView.balance = legacyData.balance;
      tokenView.lastClaimAt = legacyData.lastClaimAt;
      tokenView.claimable = legacyData.claimable;
    // else if its an actual valid token, resolve claimable amount
    } else if (isValid && isSeeded) {
      tokenView.claimable = claimable(nft, tokenId);
    } else {
      // invalid tokens cannot compute claimable, claimable stays zero
    }

    return tokenView;
  }

  // gets a batch of tokens, OR empty (zero-ed out) struct if not found, DOES
  // NOT THROW if invalid token in order to be more accomodating for callers
  function batchGetToken(Token[] memory tokens) external view returns (TokenView[] memory) {
    TokenView[] memory data = new TokenView[](tokens.length);

    for (uint256 i = 0; i < tokens.length; i++) {
      data[i] = getToken(tokens[i].nft, tokens[i].tokenId);
    }

    return data;
  }

  // ---
  // utils
  // ---

  // returns true if token exists (and is not burnt)
  function _isTokenValid(IERC721 nft, uint256 tokenId) internal view returns (bool) {
    try nft.ownerOf(tokenId) returns (address) {
      return true;
    } catch  {
      return false;
    }
  }

  // return token URI if metadata is implemented, else empty string
  function _tokenURIOrEmpty(IERC721 nft, uint256 tokenId) internal view returns (string memory) {
    try IERC721Metadata(address(nft)).tokenURI(tokenId) returns (string memory uri) {
      return uri;
    } catch  {
      return "";
    }
  }

  // returns true if operator can manage tokenId
  function _isApprovedOrOwner(IERC721 nft, uint256 tokenId, address operator) internal view returns (bool) {
    address owner = nft.ownerOf(tokenId);
    return owner == operator
      || nft.getApproved(tokenId) == operator
      || nft.isApprovedForAll(owner, operator);
  }

}
