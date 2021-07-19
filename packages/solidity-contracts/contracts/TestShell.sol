// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./MetaNFT.sol";
import "./MetadataResolver.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract TestShell is MetadataResolver {
  using Strings for uint256;

  string[] public images = [
    "ipfs://ipfs/QmaQhk8JTVTxNeWjA3aym7qTEDDE8B1mFssE1ufSN49Y8Y",
    "ipfs://ipfs/QmQkAKH84WgjACadJ3Z4feNCEEozfWrt4Z32WXYmZfFkRn",
    "ipfs://ipfs/QmVw3oFRMU5VTXsDaztaLL5hdZKajUCKKiH9cx4FyMEpZx",
    "ipfs://ipfs/QmZ17NGQu6FiCdEAPcg7nUZYiA1gMkT7U9oZkECaQKCYo9"
  ];

  function _computeName(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    return string(abi.encodePacked(nft.name(), " #", tokenId.toString()));
  }

  function _computeDescription(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    TokenViewData memory token = nft.getTokenData(tokenId);
    // return string(abi.encodePacked("hey", uint256(uint160(token.creator)).toHexString(20), "back"));
    return string(abi.encodePacked(
      "This [NTEST] is a self-sovereign modular application platform.\\n\\n",
      "A personal, tokenized carrier wave for the PTEST protocol.\\n\\n",
      "Have you minted yours?\\n\\n",
      "---\\n\\n",
      "Originally minted by ",
      uint256(uint160(token.creator)).toHexString(20),
      " at timestamp ", uint256(token.createdAtTimestamp).toString(), "." ,
      token.isVip
        ? "\\n\\nThis NFT was a PTEST founder's first minted [NTEST].\\n\\n"
        : "\\n\\n",
      "https://website.com"
    ));
  }

  function _computeExternalUrl(MetaNFT, uint256) override internal pure returns (string memory) {
    return "https://website.com";
  }

  function _computeImageUri(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    TokenViewData memory token = nft.getTokenData(tokenId);
    uint256 idx = token.seed % images.length;
    return images[idx];
  }
}
