// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

// Core ERC-20 contract for the BVAL-NFT project. Generalized ERC-20 with RBAC
// to allow for initial flexibility initially while having a method to renounce
// the more overreaching roles, prevent future minting, etc
contract CoreERC20 is AccessControlEnumerable, ERC20Pausable {

  // grants ability to mint tokens
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  // grants ability to grant MINTER_ROLE.
  bytes32 public constant PAUSER_ADMIN_ROLE = keccak256("PAUSER_ADMIN_ROLE");

  // grants ability to mint tokens
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  // grants ability to grant MINTER_ROLE.
  bytes32 public constant MINTER_ADMIN_ROLE = keccak256("MINTER_ADMIN_ROLE");

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    address msgSender = _msgSender();

    // only existing admins can add new admins
    _setRoleAdmin(PAUSER_ADMIN_ROLE, PAUSER_ADMIN_ROLE);
    _setRoleAdmin(MINTER_ADMIN_ROLE, MINTER_ADMIN_ROLE);

    // specific admin role for each actual role
    _setRoleAdmin(PAUSER_ROLE, PAUSER_ADMIN_ROLE);
    _setRoleAdmin(MINTER_ROLE, MINTER_ADMIN_ROLE);

    // contract deployer starts with ability to admin all roles
    _setupRole(PAUSER_ADMIN_ROLE, msgSender);
    _setupRole(MINTER_ADMIN_ROLE, msgSender);

    // contract deployer starts with ability to mint and pause
    _setupRole(MINTER_ROLE, msgSender);
    _setupRole(PAUSER_ROLE, msgSender);
  }

  // ---
  // pausing
  // --

  function pause() external {
    require(hasRole(PAUSER_ROLE, _msgSender()), "requires PAUSER_ROLE");
    _pause();
  }

  function unpause() external {
    require(hasRole(PAUSER_ROLE, _msgSender()), "requires PAUSER_ROLE");
    _unpause();
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
