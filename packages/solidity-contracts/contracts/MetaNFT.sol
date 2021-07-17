// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IOpenSeaContractURI.sol";

// data persisted when a token is minted
struct MintData {
  address creator;
  uint256 timestamp;
  uint256 blockNumber;
  uint256 seed;
  bool isVip;
  bool isCredit;
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
  IERC20 token;
  IMetadataResolver defaultMetadataResolver;
  uint256 mintCost;
  uint256 maxMints;
  address[] vips;
}

// General utility NFT contract that costs a token to mint and has hot-swappable
// metadata resolvers
contract MetaNFT is AccessControlEnumerable, ERC721Enumerable {

  // grants ability to set metadata resolver for a token
  bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");

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

  // primary incrementing ID
  uint256 private _nextId;

  constructor(MetaNFTOptions memory options) ERC721(options.name, options.symbol) {

    // deployer gets admin and config role
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(CONFIG_ROLE, _msgSender());

    // set options from constructor arg
    token = options.token;
    mintCost = options.mintCost;
    maxMints = options.maxMints;
    defaultMetadataResolver = options.defaultMetadataResolver;

    // set VIP flag for all VIPs and hand out a single credit
    address[] memory vips = options.vips;
    for (uint256 i = 0; i < vips.length; i++) {
      hasReservedToken[vips[i]] = true;
    }

    // first non-vip token starts after all VIP tokens
    _nextId = vips.length + 1;
  }

  // ---
  // admin
  // ---

  function setMintCost(uint256 cost) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    mintCost = cost;
  }

  function setMaxMints(uint256 max) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    maxMints = max;
  }

  function setDefaultMetadataResolver(IMetadataResolver resolver) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    defaultMetadataResolver = resolver;
  }

  function setToken(IERC20 _token) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    token = _token;
  }

  function addCredits(Credit[] memory creditsToAdd) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    for (uint256 i = 0; i < creditsToAdd.length; i++) {
      Credit memory c = creditsToAdd[i];
      mintCreditsRemaining[c.account] += c.credits;
    }
  }

  // ---
  // system
  // ---

  function setMetadataResolver(uint256 tokenId, IMetadataResolver resolver) external {
    require(hasRole(CONFIG_ROLE, _msgSender()), "requires CONFIG_ROLE");
    resolvers[tokenId] = resolver;
  }

  // ---
  // minting
  // ---

  function mint() public {
    address msgSender = _msgSender();

    bool isVip;
    bool isCredit;
    uint256 tokenId;

    if (hasReservedToken[msgSender]) {
      delete hasReservedToken[msgSender];
      isVip = true;
      tokenId = ++claimedVipMints;
    } else if (mintCreditsRemaining[msgSender] > 0) {
      mintCreditsRemaining[msgSender] -= 1;
      isCredit = true;
      tokenId = _nextId++;
    } else if (mintCost > 0) {
      require(mintedByAddress[msgSender].length < maxMints, "max mints exceeded");
      token.transferFrom(msgSender, address(this), mintCost);
      tokenId = _nextId++;
    } else {
      require(mintedByAddress[msgSender].length < maxMints, "max mints exceeded");
      tokenId = _nextId++;
    }

    _mint(msgSender, tokenId);
    mintedByAddress[msgSender].push(tokenId);
    mintData[tokenId] = MintData({
      creator: msgSender,
      timestamp: block.timestamp,
      blockNumber: block.number,
      seed: uint256(keccak256(abi.encodePacked(msgSender, tokenId, block.number))),
      isCredit: isCredit,
      isVip: isVip
    });

  }

  // ---
  // views
  // ---

  function mintCountByAddress(address account) external view returns (uint256) {
    return mintedByAddress[account].length;
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
