// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoreERC721.sol";

// @bvalosek ERC-721 Token
contract BVAL721 is CoreERC721 {
  constructor(string memory baseURI) CoreERC721(ContractOptions({
    name: "@bvalosek",
    description: "@bvalosek NFT Collection",
    data: "TODO",
    symbol: "BVAL-NFT",
    feeBps: 1000,
    collectionMetadataCID: "TODO"
  })) { }
}
