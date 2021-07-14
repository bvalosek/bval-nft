// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./NFTTokenFaucetV2.sol";

contract TokenManager is AccessControlEnumerable {

	// wellspring pointer
	NFTTokenFaucetV2 private _faucet;

	// the mined token
	IERC20 private _token;

	// store all tags, can be used to fully enumarate all managed tokens
	EnumerableSet.UintSet private _tags;

  // mapping from account -> granted funds
  mapping (address => uint256) private _balances;

	// tag => token IDs
	mapping (uint256 => uint256[]) private _tagLists;

	// token ID => tags
	mapping (uint256 => uint256[]) private _tokenTags;

	function grant(address account, uint256 amount) external {
		_balances[account] += amount;
		_token.transferFrom(_msgSender(), address(this), amount);
	}

	function getTokensByTag(uint256 tag) external returns (uint256[] memory) {
		return _tagLists[tag];
	}

	function getTokensByTag(uint256 tag) external returns (uint256[] memory) {
		return _tagLists[tag];
	}

	function _tagToken(uint256 tokenId, uint256[] memory tags) internal {
		uint256[] storage existing = _tokenTags[tokenId];
		for (uint i = 0; i < tags.length; i++) {
			uint256 tag = tags[i];
			existing.push(tag);
			_tagLists[tag].push(tokenId);
			_tags.add(tag);
		}
	}

}
