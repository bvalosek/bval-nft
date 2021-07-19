// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IOpenSeaContractURI.sol";

// data persisted when a token is minted
struct MintData {
  address creator;   // 20 bytes
  bool isVip;        // 1 byte
  uint64 timestamp;  // 8 bytes
  uint256 seed;
}

// view data for a single token
struct TokenViewData {
  uint256 id;
  address owner;
  address creator;
  uint256 createdAtTimestamp;
  uint256 seed;
  bool isVip;
}

// use to batch-add credits
struct Credit {
  address account;
  uint256 credits;
}

// a contract that can resolve the tokenURI value for an nft as a function of
// its contract address and token ID
interface IMetadataResolver {
  function getTokenURI(MetaNFT nft, uint256 tokenId) external view returns (string memory);
}

// Data passed during contract creation
struct MetaNFTOptions {
  string name;
  string symbol;
  string contractURI;
  IERC20 token;
  IMetadataResolver defaultMetadataResolver;
  uint256 mintCost;
  uint256 maxMints;
}

// General utility NFT contract that costs a token to mint and has hot-swappable
// metadata resolvers
contract MetaNFT is AccessControlEnumerable, ERC721Enumerable {

  // grants ability to set metadata resolver for a token
  bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");

  // grants ability to withdraw payments
  bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

  // utility token
  IERC20 public token;

  // cost in the utility token to mint, if no credits
  uint256 public mintCost;

  // max number of mints per address, does not apply to VIP mint or credits
  uint256 public maxMints;

  // total number of VIPs that claimed their free mint
  uint256 public claimedVipMints;

  // metadata resolver if there is not a token-specific one set
  IMetadataResolver public defaultMetadataResolver;

  // mapping from an address to a flag indicating it can claim a reserved token
  mapping (address => bool) public hasReservedToken;

  // count of free mints remaining for an address
  mapping (address => uint256) public mintCreditsRemaining;

  // data saved during mint
  mapping (uint256 => MintData) public mintData;

  // token id -> resolver
  mapping (uint256 => IMetadataResolver) public resolvers;

  // all NFTs minted by a specific address
  mapping (address => uint256[]) public mintedByAddress;

  // opensea collection metadata
  string public contractURI;

  // primary incrementing ID
  uint256 private _nextId = 1;

  constructor(MetaNFTOptions memory options) ERC721(options.name, options.symbol) {

    // deployer gets admin and config role
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(CONFIG_ROLE, msg.sender);
    _setupRole(WITHDRAW_ROLE, msg.sender);

    // set options from constructor arg
    token = options.token;
    mintCost = options.mintCost;
    maxMints = options.maxMints;
    defaultMetadataResolver = options.defaultMetadataResolver;
    contractURI = options.contractURI;
  }

  // ---
  // admin
  // ---

  modifier isAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "requires DEFAULT_ADMIN_ROLE");
    _;
  }

  // set the VIPs that get a free and reserved NFT, cant be called once minting has started
  function setVips(address[] memory vips) external isAdmin {
    require(_nextId == 1, "cannot set VIPs after minting has started");
    for (uint256 i = 0; i < vips.length; i++) {
      hasReservedToken[vips[i]] = true;
    }

    // first non-vip token starts after all VIP tokens
    _nextId = vips.length + 1;
  }

  // change the contract URI (opensea metadata)
  function setContractURI(string memory uri) external isAdmin {
    contractURI = uri;
  }

  // set the utility token cost to mint
  function setMintCost(uint256 cost) external isAdmin {
    mintCost = cost;
  }

  // set max mints per address
  function setMaxMints(uint256 max) external isAdmin {
    maxMints = max;
  }

  // set the default metadata resolver for tokens that dont have a resolver override
  function setDefaultMetadataResolver(IMetadataResolver resolver) external isAdmin {
    defaultMetadataResolver = resolver;
  }

  // set the utility token used for purchasing mints
  function setToken(IERC20 token_) external isAdmin {
    token = token_;
  }

  // add credits to addresses
  function addCredits(Credit[] memory creditsToAdd) external isAdmin {
    for (uint256 i = 0; i < creditsToAdd.length; i++) {
      Credit memory c = creditsToAdd[i];
      mintCreditsRemaining[c.account] += c.credits;
    }
  }

  // ---
  // payments
  // --

  // withdraw funds from the contract
  function withdraw(IERC20 token_) external {
    require(hasRole(WITHDRAW_ROLE, msg.sender), "requires WITHDRAW_ROLE");
    token_.transfer(msg.sender, token_.balanceOf(address(this)));
  }

  // ---
  // system
  // ---

  function setMetadataResolver(uint256 tokenId, IMetadataResolver resolver) external {
    require(hasRole(CONFIG_ROLE, msg.sender), "requires CONFIG_ROLE");
    resolvers[tokenId] = resolver;
  }

  // ---
  // minting
  // ---

  function mint() public {
    address minter = msg.sender;

    bool isVip;
    bool isCredit;
    uint256 tokenId;

    if (hasReservedToken[minter]) {
      delete hasReservedToken[minter];
      isVip = true;
      tokenId = ++claimedVipMints;
    } else if (mintCreditsRemaining[minter] > 0) {
      mintCreditsRemaining[minter] -= 1;
      isCredit = true;
      tokenId = _nextId++;
    } else if (mintCost > 0) {
      require(mintedByAddress[minter].length < maxMints, "this address has minted the max amount of NFTs");
      token.transferFrom(minter, address(this), mintCost);
      tokenId = _nextId++;
    } else {
      require(mintedByAddress[minter].length < maxMints, "this address has minted the max amount of NFTs");
      tokenId = _nextId++;
    }

    _mint(minter, tokenId);
    mintedByAddress[minter].push(tokenId);

    // seed is a semi-random uint256, which can be used for downstream features.
    // it can be influenced by a miner to target a specific seed value so it
    // should not be depended on for anything "too important"
    uint256 seed = uint256(keccak256(abi.encodePacked(
      minter,
      tokenId,
      block.timestamp,
      blockhash(block.number)
    )));

    mintData[tokenId] = MintData({
      creator: minter,
      timestamp: uint64(block.timestamp),
      seed: seed,
      isVip: isVip
    });

  }

  // ---
  // views
  // ---

  function mintCountByAddress(address account) external view returns (uint256) {
    return mintedByAddress[account].length;
  }

  function getTokenData(uint256 tokenId) public view returns (TokenViewData memory) {
    require(_exists(tokenId), "invalid token");
    MintData memory mData = mintData[tokenId];
    return TokenViewData({
      id: tokenId,
      owner: ownerOf(tokenId),
      creator: mData.creator,
      createdAtTimestamp: mData.timestamp,
      seed: mData.seed,
      isVip: mData.isVip
    });
  }

  // get a comprehensive view for an array of token IDs
  function batchGetTokenData(uint256[] memory tokenIds) external view returns (TokenViewData[] memory) {
    TokenViewData[] memory data = new TokenViewData[](tokenIds.length);

    for (uint256 i = 0; i < tokenIds.length; i++) {
      data[i] = getTokenData(tokenIds[i]);
    }

    return data;
  }

  // ---
  // metadata
  // ---

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "invalid token");

    IMetadataResolver resolver = resolvers[tokenId];
    if (resolver != IMetadataResolver(address(0))) {
      return resolver.getTokenURI(this, tokenId);
    }

    return defaultMetadataResolver.getTokenURI(this, tokenId);
  }

  // ---
  // introspection
  // ---

  // ERC165
  function supportsInterface(bytes4 interfaceId) public view virtual override (ERC721Enumerable, AccessControlEnumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
