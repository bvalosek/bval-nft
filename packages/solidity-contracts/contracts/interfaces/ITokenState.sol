// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// allow tokens to have a 256 bit state value
interface ITokenState {

    // announce a change in token state
    event TokenState(
        uint256 indexed tokenId,
        uint256 indexed input,
        uint256 indexed state);

    // batch input entry to set token state
    struct SetTokenState {
        uint256 tokenId;
        uint256 input;
    }

    // set the a tokens state
    function setTokenState(SetTokenState[] calldata entries) external;

    // get a token's state
    function getTokenState(uint256 tokenId) external view returns (uint256);

}
