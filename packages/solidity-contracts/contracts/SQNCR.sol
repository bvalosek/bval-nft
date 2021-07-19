// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MetaNFT.sol";

struct SQNCROptions {
  IERC20 token;
  IMetadataResolver defaultShell;
}

contract SQNCR is MetaNFT {
  constructor(SQNCROptions memory options) MetaNFT(MetaNFTOptions({
    name: "VIBES [SQNCR]",
    symbol: "SQNCR",
    token: options.token,
    defaultMetadataResolver: options.defaultShell,
    contractURI: "ipfs://ipfs/QmTdoCbC4nHLZH3EUXJZ6LggH3HWLuJv8zqzJLqZSgYrLn",
    mintCost: 0,
    maxMints: 100
  })) { }
}
