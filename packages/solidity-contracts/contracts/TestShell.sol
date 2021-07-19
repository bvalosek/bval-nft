// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./MetaNFT.sol";
import "./MetadataResolver.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract TestShell is MetadataResolver {
  using Strings for uint256;

  function _computeName(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    return string(abi.encodePacked(nft.name(), " #", tokenId.toString()));
  }

  function _computeDescription(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    TokenViewData memory token = nft.getTokenData(tokenId);
    return string(abi.encodePacked(
      "This is not a collectible; this is a self-sovereign modular application platform.\\n\\n",
      "Your [NTEST#", tokenId.toString(), "] is your personal carrier wave for the PTEST protocol.\\n\\n",
      "Have you minted yours?\\n\\n",
      "---\\n\\n",
      "Originally minted by ", uint256(uint160(token.creator)).toHexString(20),
      " at timestamp ", token.createdAtTimestamp.toString(), ".\\n\\n" ,
      token.isVip
        ? "This NFT was a PTEST founder's first minted [NTEST].\\n\\n"
        : "",
      "https://website.com"
    ));
  }

  function _computeExternalUrl(MetaNFT, uint256) override internal pure returns (string memory) {
    return "https://website.com";
  }

  function _computeImageUri(MetaNFT, uint256) override internal pure returns (string memory) {
    return "ipfs://ipfs/QmWcFCdDeDsSbty62PSm6dE8Yr3CtRBXFg3YwsdGyHauLK";
  }
}
