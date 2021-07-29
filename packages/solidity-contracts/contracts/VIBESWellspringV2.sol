// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTTokenFaucetV3.sol";

contract FaucetV3 is NFTTokenFaucetV3 {

  string public constant name = 'FaucetV3';

  constructor(FaucetContractOptions memory options) NFTTokenFaucetV3(options) { }

}
