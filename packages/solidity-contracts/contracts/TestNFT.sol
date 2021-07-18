// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MetaNFT.sol";

contract TestNFT is MetaNFT {
	constructor() MetaNFT(MetaNFTOptions({
		name: "Test NFT",
		symbol: "TEST",
		token: IERC20(0xd269af9008C674B3814b4830771453D6a30616eb),
		defaultMetadataResolver: IMetadataResolver(0xd269af9008C674B3814b4830771453D6a30616eb),
		mintCost: 0,
		maxMints: 0
	})) { }
}
