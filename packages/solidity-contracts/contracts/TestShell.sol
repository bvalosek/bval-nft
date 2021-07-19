// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./MetaNFT.sol";
import "./MetadataResolver.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract TestShell is MetadataResolver {
	using Strings for uint256;

	function _computeName(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
		return string(abi.encodePacked(nft.name(), " #", tokenId.toString()));
	}

	function _computeDescription(MetaNFT nft, uint256 tokenId) override internal view returns (string memory) {
		TokenViewData memory token = nft.getTokenData(tokenId);
		return string(abi.encodePacked(
			"This token was minted in block ", token.createdAtBlock.toString(),
			" at timestamp ", token.createdAtTimestamp.toString(),
			" by address ", uint256(uint160(token.creator)).toHexString(20), ".\\n\\n",
			"isVip: ", token.isVip ? "true" : "false", ".\\n\\n",
			"isCredit: ", token.isCredit ? "true" : "false", ".\\n\\n",
			"seed: ", token.seed.toHexString(32)
		));
	}

	function _computeImageUri(MetaNFT, uint256) override internal pure returns (string memory) {
		return "https://gateway.pinata.cloud/ipfs/QmWcFCdDeDsSbty62PSm6dE8Yr3CtRBXFg3YwsdGyHauLK";
	}
}
