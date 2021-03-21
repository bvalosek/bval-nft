// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// parse the encoded data in a token ID
library TokenID {

  function tokenVersion(uint256 tokenId) internal pure returns (uint8) {
    return uint8(tokenId >> 31*8);
  }

  function tokenCollectionNumber(uint256 tokenId) internal pure returns (uint16) {
    return uint16(tokenId >> 28*8);
  }

  function tokenSequenceNumber(uint256 tokenId) internal pure returns (uint16) {
    return uint16(tokenId >> 26*8);
  }

  function tokenMintTimestamp(uint256 tokenId) internal pure returns (uint) {
    uint16 daystamp = uint16(tokenId >> 24*8);
    return uint(daystamp) * 60 * 60 * 24;
  }

  function isTokenValid(uint256 tokenId) internal pure returns (bool) {
    uint8 checksum = uint8(tokenId >> 30 * 8);
    uint256 masked = tokenId & 0xff00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint8 computed = uint8(uint256(keccak256(abi.encodePacked(masked))));
    return checksum == computed;
  }

}
