// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./libraries/Base64.sol";
import "./MetaNFT.sol";

// erc721 metadata attribute
struct Attribute {
  string name;
  string value;
}

abstract contract MetadataResolver is IMetadataResolver {

  function getTokenURI(MetaNFT nft, uint256 tokenId) override external view returns (string memory) {
    string memory name = _computeName(nft, tokenId);
    string memory description = _computeDescription(nft, tokenId);
    string memory image = _computeImageUri(nft, tokenId);
    string memory externalUrl = _computeExternalUrl(nft, tokenId);

    return string(abi.encodePacked(
      'data:application/json;base64,',
      Base64.encode(bytes(abi.encodePacked(
        '{"name":"', name,
        '", "description":"', description,
        '", "image": "', image,
        '", "external_url": "', externalUrl,
        '"}'
      )))
    ));
  }

  // compute the metadata name for a given token
  function _computeName(MetaNFT nft, uint256 tokenId) virtual internal view returns (string memory);

  // compute the metadata description for a given token
  function _computeDescription(MetaNFT nft, uint256 tokenId) virtual internal view returns (string memory);

  // compute the metadata image field for a given token
  function _computeImageUri(MetaNFT nft, uint256 tokenId) virtual internal view returns (string memory);

  // compute the external_url field for a given token
  function _computeExternalUrl(MetaNFT nft, uint256 tokenId) virtual internal view returns (string memory);
}
