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
    string memory name = _escapeQuotes(_computeName(nft, tokenId));
    string memory description = _escapeQuotes(_computeDescription(nft, tokenId));
    string memory image = _escapeQuotes(_computeImageUri(nft, tokenId));
    string memory externalUrl = _escapeQuotes(_computeImageUri(nft, tokenId));

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

  // https://github.com/Uniswap/uniswap-v3-periphery/blob/main/contracts/libraries/NFTDescriptor.sol#L85
  function _escapeQuotes(string memory symbol) internal pure returns (string memory) {
    bytes memory symbolBytes = bytes(symbol);
    uint8 quotesCount = 0;
    for (uint8 i = 0; i < symbolBytes.length; i++) {
      if (symbolBytes[i] == '"') {
        quotesCount++;
      }
    }
    if (quotesCount > 0) {
      bytes memory escapedBytes = new bytes(symbolBytes.length + (quotesCount));
      uint256 index;
      for (uint8 i = 0; i < symbolBytes.length; i++) {
        if (symbolBytes[i] == '"') {
          escapedBytes[index++] = '\\';
        }
        escapedBytes[index++] = symbolBytes[i];
      }
      return string(escapedBytes);
    }
    return symbol;
  }

}
