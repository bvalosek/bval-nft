// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTTokenFaucetV2.sol";

contract VIBESWellspring is NFTTokenFaucetV2 {

  string public constant name = 'VIBES Wellspring';

  constructor(FaucetOptions memory options) NFTTokenFaucetV2(options) { }

}
