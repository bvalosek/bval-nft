// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Payment {
  address to;
  uint256 amount;
  string reason;
}

contract Multipay is AccessControlEnumerable {

  event PaymentBatch(
    uint256 indexed batchId,
    string summary
  );

  event PaymentSent(
    address indexed to,
    uint256 indexed batchId,
    IERC20 indexed token,
    uint256 amount,
    string reason
  );

  uint256 public nextBatchId = 1;

  // can use the contract
  bytes32 public constant PAYER_ROLE = keccak256("PAYER_ROLE");

  constructor() {
    _setRoleAdmin(PAYER_ROLE, DEFAULT_ADMIN_ROLE);

    // contract deployer gets roles
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(PAYER_ROLE, msg.sender);
  }

  // pay a batch of recipients
  function pay(IERC20 token, string memory summary, Payment[] memory payments) external {
    require(hasRole(PAYER_ROLE, msg.sender), "requires PAYER_ROLE");

    uint256 batchId = nextBatchId++;

    for (uint256 i = 0; i < payments.length; i++) {
      address to = payments[i].to;
      uint256 amount = payments[i].amount;
      token.transferFrom(msg.sender, to, amount);
      emit PaymentSent(to, batchId, token, amount, payments[i].reason);
    }

    emit PaymentBatch(batchId, summary);
  }

}
