// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./VotePower.sol";
import "./NFTTokenFaucetV2.sol";

// vote power from erc20 balance
contract ERC20BalanceStrategy is IVotePowerStrategy {
  IERC20 public token;

  constructor(IERC20 _token) {
    token = _token;
  }

  function getName() override external pure returns (string memory) {
    return "ERC20 Token Balance";
  }

  function getVotePower(address voter) override external view returns (uint256) {
    return token.balanceOf(voter);
  }
}

// vote power from claimable tokens from nft token faucet
contract NFTTokenFaucetStrategy is IVotePowerStrategy {
  NFTTokenFaucetV2 public faucet;

  constructor(NFTTokenFaucetV2 _faucet) {
    faucet = _faucet;
  }

  function getName() override external pure returns (string memory) {
    return "NFTTokenFaucetV2 Claimable";
  }

  function getVotePower(address voter) override external view returns (uint256) {
    uint256 power = 0;
    uint256 count = faucet.tokenCount();

    for (uint i = 0; i < count; i++) {
      ManagedTokenInfo memory info = faucet.tokenInfo(faucet.tokenIdAt(i));
      power += info.owner == voter ? info.claimable : 0;
    }

    return power;
  }
}

// uniswap / quickswap pair
interface IPair {
  function totalSupply() external view returns (uint);
  function balanceOf(address owner) external view returns (uint);
  function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  function token0() external view returns (address);
  function token1() external view returns (address);
}

// vote power from pooled tokens in a uniswap/quickswap pair
contract UniswapPoolStrategy is IVotePowerStrategy {
  IPair public pair;
  bool private _useToken1;

  constructor(IPair _pair, IERC20 token) {
    pair = _pair;
    if (pair.token0() == address(token)) {
      _useToken1 = false;
    } else if (pair.token1() == address(token)) {
      _useToken1 = true;
    } else {
      revert("token is not part pair");
    }
  }

  function getName() override external pure returns (string memory) {
    return "Uniswap Pool";
  }

  function getVotePower(address voter) override external view returns (uint256) {
    (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();
    uint reserve = _useToken1 ? reserve1 : reserve0;
    uint totalSupply = pair.totalSupply();
    uint lpBalance = pair.balanceOf(voter);
    return lpBalance * reserve / totalSupply;
  }
}
