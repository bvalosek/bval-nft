// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./interfaces/IOpenSeaContractURI.sol";
import "./interfaces/IRaribleRoyalties.sol";
import "./interfaces/IERC2981.sol";

import "./Sequenced.sol";
import "./TokenID.sol";

// a contract that can resolve the specific metadata index for a given token
interface IMetadataIndexResolver is IERC165 {
  // should return the metadata index for a specific token
  function metadataIndex(uint256 tokenId) external view returns (uint);
}

// constructor options
struct CollectionOptions {
  string name;
  string symbol;
  string collectionMetadataCID;
  uint16 feeBps;
}

// data required to mint a new token
struct TokenMintData {
  uint256 tokenId;
  string[] metadataCIDs;
}

// A general enumerable/metadata-enabled 721 contract with several extra
// features added
//
// Adds:
// - royality support (rarible, EIP2981)
// - RBAC via AccessControlEnumerable
// - tokenID parsing/validation
// - sequenced functionality
// - dynamically resolved metadata variations
contract CoreERC721 is
  // openzep bases
  AccessControlEnumerable, ERC721Enumerable,

  // sequenced functionality
  Sequenced,

  // marketplace interfaces
  IRaribleRoyalties, IOpenSeaContractURI, IERC2981

  {

  using TokenID for uint256;

  // able to mint and manage sequences
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  // royality fee BPS (1/100ths of a percent, eg 1000 = 10%)
  uint16 private immutable _feeBps;

  // address to send royalties to
  address private _royaltyRecipient;

  // ipfs base when calculating tokenURI
  string private _ipfsBaseURI = "ipfs://ipfs/";

  // collection metadata
  string private _collectionMetadataCID;

  // token metadata CIDs
  mapping (uint256 => string[]) private _tokenMetadataCIDs;

  // mapping from a sequence number to a metadata index resolver contract
  mapping (uint16 => IMetadataIndexResolver) private _metadataIndexResolvers;

  constructor (CollectionOptions memory options) ERC721(options.name, options.symbol) {
    address msgSender = _msgSender();

    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
    _setupRole(MINTER_ROLE, msgSender);

    _feeBps = options.feeBps;
    _collectionMetadataCID = options.collectionMetadataCID;
    _royaltyRecipient = msgSender;
  }

  // ---
  // Admin
  // ---

  // swap out IPFS base URI
  function setIPFSBaseURI(string calldata uri) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _ipfsBaseURI = uri;
  }

  // set address that royalties are sent to
  function setRoyaltyRecipient(address recipient) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "requires DEFAULT_ADMIN_ROLE");
    _royaltyRecipient = recipient;
  }

  // ---
  // ERC-721 basics
  // ---

  // destroy a token
  function burn(uint256 tokenId) public virtual {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "not token owner");
    _burn(tokenId);
  }

  // ---
  // Minting
  // ---

  // mint a new token for the contract owner and emit metadata as an event
  function mint(TokenMintData memory data) public {
    address msgSender = _msgSender();
    uint256 tokenId = data.tokenId;

    require(hasRole(MINTER_ROLE, msgSender), "requires MINTER_ROLE");
    require(tokenId.isTokenValid() == true, "malformed token");
    require(tokenId.tokenVersion() > 0, "invalid token version");
    require(getSequenceState(tokenId.tokenSequenceNumber()) == SequenceState.STARTED, "sequence is not active");

    uint today = (block.timestamp / 1 days) * 1 days; // round down to today
    require(tokenId.tokenMintTimestamp() >= today, "token mint date in the past");
    require(tokenId.tokenMintTimestamp() < today + 1 days, "token mint date in the future");

    // create the NFT and persist CID / emit metadata
    _mint(msgSender, tokenId);
    _tokenMetadataCIDs[tokenId] = data.metadataCIDs;

    // emit rarible royalty info
    address[] memory recipients = new address[](1);
    recipients[0] = _royaltyRecipient;
    emit SecondarySaleFees(tokenId, recipients, getFeeBps(tokenId));
  }

  // start a sequence, mint some tokens, and complete a sequence
  function atomicMint(SequenceCreateData memory sequence, TokenMintData[] memory tokens) external {
    // no access control check here since each individual step is already checking roles
    startSequence(sequence);
    for (uint i = 0; i < tokens.length; i++) {
      mint(tokens[i]);
    }
    completeSequence(sequence.sequenceNumber);
  }

  // ---
  // Sequences
  // ---

  // start sequence
  function startSequence(SequenceCreateData memory data) override public {
    require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");
    _startSequence(data);
  }

  // complete the sequence
  function completeSequence(uint16 number) override public {
    require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");
    _completeSequence(number);
  }

  // set the metadata index resolver for a specific sequence
  function setMetadataIndexResolver(uint16 sequenceNumber, IMetadataIndexResolver resolver) external {
    require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");
    require(getSequenceState(sequenceNumber) == SequenceState.STARTED, "sequence is not active");
    require(address(_metadataIndexResolvers[sequenceNumber]) == address(0), "metadata index resolver already set");
    require(resolver.supportsInterface(type(IMetadataIndexResolver).interfaceId) == true, "resolver does not implement IMetadataIndexResolver");
    _metadataIndexResolvers[sequenceNumber] = resolver;
  }

  // ---
  // Metadata
  // ---

  // token metadata URI
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "invalid token");

    // metadata index defaults to zero, but can be resolved by an external
    // contract if registered
    uint index = 0;
    IMetadataIndexResolver resolver = _metadataIndexResolvers[tokenId.tokenSequenceNumber()];
    if (address(resolver) != address(0)) {
      index = resolver.metadataIndex(tokenId);
      index = index > _tokenMetadataCIDs[tokenId].length ? 0 : index; // default to 0 if out of bounds
    }

    string memory cid = _tokenMetadataCIDs[tokenId][index];
    return string(abi.encodePacked(_ipfsBaseURI, cid));
  }

  // contract metadata URI (opensea)
  function contractURI() external view override returns (string memory) {
    return string(abi.encodePacked(_ipfsBaseURI, _collectionMetadataCID));
  }

  // ---
  // rarible
  // ---

  // rarible royalties
  function getFeeRecipients(uint256 tokenId) override public view returns (address payable[] memory) {
    require(_exists(tokenId), "invalid token");
    address payable[] memory ret = new address payable[](1);
    ret[0] = payable(_royaltyRecipient);
    return ret;
  }

  // rarible royalties
  function getFeeBps(uint256 tokenId) override public view returns (uint[] memory) {
    require(_exists(tokenId), "invalid token");
    uint256[] memory ret = new uint[](1);
    ret[0] = uint(_feeBps);
    return ret;
  }

  // ---
  // More royalities (mintable?) / EIP-2981
  // ---

  function royaltyInfo(uint256 tokenId) override external view returns (address receiver, uint256 amount) {
    require(_exists(tokenId), "invalid token");
    return (_royaltyRecipient, uint256(_feeBps) * 100);
  }

  // ---
  // introspection
  // ---

  // ERC165
  function supportsInterface(bytes4 interfaceId) public view virtual override (IERC165, ERC721Enumerable, AccessControlEnumerable) returns (bool) {
    return interfaceId == type(IERC2981).interfaceId
      || interfaceId == type(IOpenSeaContractURI).interfaceId
      || interfaceId == type(IRaribleRoyalties).interfaceId
      // covers ERC721, ERC721Metadata, ERC721Enumerable
      || super.supportsInterface(interfaceId);
  }

  // ---
  // openzep Hooks
  // ---

  // open zep hook called on all transfers (including burn/mint)
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) override internal virtual {
    // clean up on burn
    if (to == address(0)) {
      delete _tokenMetadataCIDs[tokenId];
    }

    super._beforeTokenTransfer(from, to, tokenId);
  }

}
