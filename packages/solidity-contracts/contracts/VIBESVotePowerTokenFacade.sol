// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./VotePower.sol";

// An ERC-20 compat contract that just reports VIBES vote power as balance
// This is not a real token, used for interop w/ tools like collab.land
contract VotePowerTokenFacade is ERC20 {
  VotePower public constant votePower = VotePower(0xA2f67C69B1F5cFa725839a110901761C718eeB59);

  constructor() ERC20('VIBES Vote Power', 'govVIBES') { }

  // balanceOf will return VIBES vote power
  function balanceOf(address account) public view virtual override returns (uint256) {
    return votePower.getVotePower(account);
  }

  function transfer(address, uint256) public virtual override returns (bool) {
    revert("this is not a real token");
  }

  function approve(address, uint256) public virtual override returns (bool) {
    revert("this is not a real token");
  }

  function transferFrom(address, address, uint256) public virtual override returns (bool) {
    revert("this is not a real token");
  }

  function increaseAllowance(address, uint256) override public virtual returns (bool) {
    revert("this is not a real token");
  }

  function decreaseAllowance(address, uint256) override public virtual returns (bool) {
    revert("this is not a real token");
  }

}
