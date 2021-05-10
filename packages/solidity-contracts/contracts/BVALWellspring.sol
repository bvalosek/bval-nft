// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTTokenFaucet.sol";

contract BVALWellspring is NFTTokenFaucet {

  string public constant name = '@bvalosek Wellspring';

  constructor(FaucetOptions memory options) NFTTokenFaucet(options) { }

}
