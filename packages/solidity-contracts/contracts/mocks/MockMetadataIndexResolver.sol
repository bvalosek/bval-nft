// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../CoreERC721.sol";

contract MockMetadataIndexResolver is IMetadataIndexResolver {
  uint private _index = 0;

  function setIndex(uint idx) external {
    _index = idx;
  }

  function metadataIndex(uint256) override external view returns (uint) {
    return _index;
  }

  function supportsInterface(bytes4 interfaceId) override public view virtual returns (bool) {
    return interfaceId == type(IMetadataIndexResolver).interfaceId;
  }
}
