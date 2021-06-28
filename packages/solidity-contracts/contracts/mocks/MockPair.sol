// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../VibesStrategies.sol";

// mock pool
// LP supply = 1000
// LP balance = 100
// reserve0 = 500, reserve1 = 700
contract MockPair is IPair {
  address private _token0;
  address private _token1;

  constructor(address t0, address t1) {
    _token0 = t0;
    _token1 = t1;
  }

  function totalSupply() override external pure returns (uint) {
    return 1000 * 10 ** 18;
  }

  function balanceOf(address) override external pure returns (uint) {
    return 100 * 10 ** 18;
  }

  function getReserves() override external pure returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) {
    return (500 * 10 ** 18, 700 * 10 ** 18, 15);
  }

  function token0() override external view returns (address) {
    return _token0;
  }

  function token1() override external view returns (address) {
    return _token1;
  }

}
