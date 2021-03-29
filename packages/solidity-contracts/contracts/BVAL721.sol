// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoreERC721.sol";

// @bvalosek ERC-721 Token
contract BVAL721 is CoreERC721 {
  constructor() CoreERC721(CollectionOptions({
    name: "@bvalosek NFT Collection",
    symbol: "BVAL-NFT",
    feeBps: 1000,
    collectionMetadataCID: "QmUqjFKbvZa3JzBWcGFuCt6UzRQukPKiySRgjVrPK2pskY"
  })) { }
}
