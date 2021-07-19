// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./MetaNFT.sol";
import "./MetadataResolver.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract DefaultShell is MetadataResolver {
  using Strings for uint256;

  string[] public images = [
    "ipfs://ipfs/QmQgyFH5nJrzSGE8mpGQxrxKbrUmCaLDxKZTMvpcUpwzt7",
    "ipfs://ipfs/Qmb2yYpgWoQcFrDcUmexgSbnyw4TNQBcfJHQier3CMMzwv",
    "ipfs://ipfs/QmdknAR4e5zydm5sgPGbQhcgZ8mudPig3e9oo6w37QC6cB",
    "ipfs://ipfs/QmbuompGpU26b3autNHueSgs6eNeToK44zbcWY9TppJktZ"
  ];

  function _computeName(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    return string(abi.encodePacked(nft.name(), " #", tokenId.toString()));
  }

  function _computeDescription(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    TokenViewData memory token = nft.getTokenData(tokenId);
    return string(abi.encodePacked(
      "This [SQNCR] is a self-sovereign modular application platform.\\n\\n",
      "A personal, tokenized carrier wave for the VIBES protocol.\\n\\n",
      "Have you minted yours?\\n\\n",
      "---\\n\\n",
      "Originally minted by ",
      uint256(uint160(token.creator)).toHexString(20),
      " at timestamp ", uint256(token.createdAtTimestamp).toString(), "." ,
      token.isVip
        ? "\\n\\nThis NFT was a VIBES founder's first minted [SQNCR].\\n\\n"
        : "\\n\\n",
      "https://sickvibes.xyz"
    ));
  }

  function _computeExternalUrl(MetaNFT, uint256) override internal pure returns (string memory) {
    return "https://sickvibes.xyz";
  }

  function _computeImageUri(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
    TokenViewData memory token = nft.getTokenData(tokenId);
    uint256 idx = token.seed % images.length;
    return images[idx];
  }
}
