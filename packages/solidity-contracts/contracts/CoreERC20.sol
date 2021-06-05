// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Core ERC-20 contract for the BVAL-NFT project.
contract CoreERC20 is AccessControlEnumerable, ERC20 {

  // grants ability to mint tokens
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  // grants ability to grant MINTER_ROLE.
  bytes32 public constant MINTER_ADMIN_ROLE = keccak256("MINTER_ADMIN_ROLE");

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    address msgSender = _msgSender();

    // minter role and admin role
    _setRoleAdmin(MINTER_ADMIN_ROLE, MINTER_ADMIN_ROLE);
    _setRoleAdmin(MINTER_ROLE, MINTER_ADMIN_ROLE);

    // contract deployer starts with ability to admin all roles and mint
    _setupRole(MINTER_ADMIN_ROLE, msgSender);
    _setupRole(MINTER_ROLE, msgSender);
  }

  // ---
  // minting
  // ---

  // mints tokens into the contract before transfer them to provided account
  // parameter
  function mintTo(address account, uint256 amount) external {
    require(hasRole(MINTER_ROLE, _msgSender()), "requires MINTER_ROLE");

    // mint tokens directly into the contract
    _mint(address(this), amount);

    // call transfer as "this" in order to transfer FROM the contract TO
    // account. Calling w/o "this" would attempt to tranfer FROM msgSender
    this.transfer(account, amount);
  }

  // ---
  // Burnable implementation
  // ---

  // burn msg sender's coins
  function burn (uint256 amount) external {
    _burn(_msgSender(), amount);
  }

}
