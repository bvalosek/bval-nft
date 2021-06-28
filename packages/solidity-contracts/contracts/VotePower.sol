// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

// individual vote strategy contract interface
interface IVotePowerStrategy {
  function getVotePower(address voter) external view returns (uint256);
  function getName() external view returns (string memory);
}

// simple on-chain vote power facade
contract VotePower is AccessControlEnumerable {
  IVotePowerStrategy[] _strategies;

  constructor () {
    address msgSender = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
  }

  // get the voting power of a specific address
  function getVotePower(address voter) external view returns (uint256) {
    uint256 power = 0;
    for (uint i = 0; i < _strategies.length; i++) {
      power += _strategies[i].getVotePower(voter);
    }
    return power;
  }

  // set the strategies to be used
  function setStrategies(IVotePowerStrategy[] memory strategies) public {
    address msgSender = _msgSender();
    require(hasRole(DEFAULT_ADMIN_ROLE, msgSender), "requires DEFAULT_ADMIN_ROLE");
    _strategies = strategies;
  }

  // get the strategies that are in use
  function getStrategies() public view returns (IVotePowerStrategy[] memory) {
    return _strategies;
  }

}
