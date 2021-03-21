// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoreERC20.sol";

// @bvalosek ERC-20 Token
contract BVAL20 is CoreERC20 {
  constructor() CoreERC20("@bvalosek", "BVAL") { }
}