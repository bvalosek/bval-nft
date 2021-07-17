// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../MetaNFT.sol";

contract MockMetadataResolver is IMetadataResolver {
  string public response;

  constructor(string memory r) {
    response = r;
  }

  function getTokenURI(MetaNFT, uint256) override external view returns (string memory) {
    return response;
  }
}
