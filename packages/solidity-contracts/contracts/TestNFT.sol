// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MetaNFT.sol";

struct TestNFTOptions {
  IERC20 token;
  IMetadataResolver defaultShell;
}

contract TestNFT is MetaNFT {
  constructor(TestNFTOptions memory options) MetaNFT(MetaNFTOptions({
    name: "Test NFT",
    symbol: "TEST",
    token: options.token,
    defaultMetadataResolver: options.defaultShell,
    contractURI: "ipfs://ipfs/QmTdoCbC4nHLZH3EUXJZ6LggH3HWLuJv8zqzJLqZSgYrLn",
    mintCost: 0,
    maxMints: 100
  })) { }
}
