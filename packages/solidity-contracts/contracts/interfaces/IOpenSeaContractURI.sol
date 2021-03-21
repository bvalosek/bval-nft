// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// opensea interface for providing information about the contract
interface IOpenSeaContractURI {

    // get the URI for the metadata for the contract (collection) info on opensea
    function contractURI() external view returns (string memory);

}
