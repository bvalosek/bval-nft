// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./@openzeppelin/AccessControlEnumerable.sol";
import "./@openzeppelin/ERC721Enumerable.sol";

import "./interfaces/IOpenSeaContractURI.sol";
import "./interfaces/IRaribleRoyalties.sol";
import "./interfaces/IERC2981.sol";

import "./Sequenced.sol";
import "./TokenID.sol";

// A general enumerable/metadata-enabled 721 contract with several extra
// features added
//
// Adds:
// - emitting token metadata via event logs
// - royality support (rarible, EIP2981)
// - RBAC via AccessControlEnumerable
// - tokenID parsing/validation
// - sequenced functionality
contract CoreERC721 is
  // openzep bases
  AccessControlEnumerable, ERC721Enumerable,

  // sequenced functionality
  Sequenced,

  // marketplace interfaces
  IRaribleRoyalties, IOpenSeaContractURI, IERC2981

  {

  using TokenID for uint256;

  // announce token metadata
  event TokenMetadata(uint256 indexed tokenId, string name, string description, string data);

  // announce collection data
  event CollectionMetadata(string name, string description, string data);

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
  mapping (uint256 => string) private _tokenMetadataCIDs;

  // constructor options
  struct ContractOptions {
    string name;
    string description;
    string data;
    string symbol;
    string collectionMetadataCID;
    uint16 feeBps;
  }

  // data required to mint a new token
  struct TokenMintData {
    uint256 tokenId;
    string name;
    string description;
    string data;
    string metadataCID;
  }

  constructor (ContractOptions memory options) ERC721(options.name, options.symbol) {
    address msgSender = _msgSender();

    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
    _setupRole(MINTER_ROLE, msgSender);

    _royaltyRecipient = msgSender;
    _feeBps = options.feeBps;
    _collectionMetadataCID = options.collectionMetadataCID;

    emit CollectionMetadata(options.name, options.description, options.data);
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
  function mint(TokenMintData memory token) external {
    address msgSender = _msgSender();
    uint256 tokenId = token.tokenId;

    require(hasRole(MINTER_ROLE, msgSender), "requires MINTER_ROLE");
    require(tokenId.isTokenValid() == true, "malformed token");
    require(tokenId.tokenVersion() > 0, "invalid token version");
    require(getSequenceState(tokenId.tokenSequenceNumber()) == SequenceState.STARTED, "sequence is not active");

    // create the NFT and persist CID / emit metadata
    _mint(msgSender, tokenId);
    _tokenMetadataCIDs[tokenId] = token.metadataCID;
    emit TokenMetadata(tokenId, token.name, token.description, token.data);

    // emit rarible royalty info
    address[] memory recipients = new address[](1);
    recipients[0] = _royaltyRecipient;
    emit SecondarySaleFees(tokenId, recipients, getFeeBps(tokenId));
  }

  // ---
  // Sequences
  // ---

  // start sequence
  function startSequence(
    uint16 number,
    string memory name_,
    string memory description_,
    string memory data_) override external {
      require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");
      _startSequence(number, name_, description_, data_);
  }

  // complete the sequence
  function completeSequence(uint16 number) override external {
    require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");
    _completeSequence(number);
  }


  // ---
  // Metadata
  // ---

  // token metadata URI
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "invalid token");
    string memory cid = _tokenMetadataCIDs[tokenId];
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
