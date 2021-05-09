// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTTokenFaucet.sol";

// @bvalosek ERC-721 Token
contract BVALWellspring is NFTTokenFaucet {

  string public constant name = '@bvalosek Wellspring';

  constructor(CoreERC20 token, CoreERC721 nft, ITokenLockManager lock)
    NFTTokenFaucet(token, nft, lock) {}
}
