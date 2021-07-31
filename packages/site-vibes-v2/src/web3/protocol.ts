import { BigNumber } from 'ethers';
import { Contract, Provider } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import VIBES from './abi/vibes.json';
import WELLSPRING from './abi/wellspring.json';
import VPA from './abi/vote-power-adapater.json';
import QUICKSWAP_PAIR from './abi/quickswap-pair.json';
import SQNCR from './abi/sqncr.json';
import WELLSPRING_V2 from './abi/wellspring-v2.json';

export interface ProtocolView {
  vibesToken: {
    address: string;
    totalSupply: BigNumber;
  };
  votePowerAdapter: {
    address: string;
    strategies: string[];
  };
  wellspring: {
    address: string;
    tokenCount: number;
    reserveVibesBalance: BigNumber;
  };
  wellspringV2: {
    address: string;
    tokenCount: number;
    totalVibesLocked: BigNumber;
  };
  sqncr: {
    address: string;
    maxMints: number;
    totalMinted: number;
    mintCost: BigNumber;
    tokenAddress: string;
  };
  gnosisSafe: {
    address: string;
    maticBalance: BigNumber;
    vibesBalance: BigNumber;
    vibesMaticLpBalance: BigNumber;
  };
  quickswap: {
    maticUsdcPrice: BigNumber;
    vibesMaticPrice: BigNumber;
    vibesUsdcPrice: BigNumber;
    vibesMaticLpUsdcPrice: BigNumber;
    vibesMaticPool: {
      address: string;
      totalSupply: BigNumber;
      vibesReserve: BigNumber;
      maticReserve: BigNumber;
      totalLiquidityUsdc: BigNumber;
    };
  };
}

export const getProtocolView = async (): Promise<ProtocolView> => {
  const contracts = getContracts();
  const provider = new Provider(getProvider(), 137);
  const vibes = new Contract(contracts.vibes, VIBES);
  const wellspring = new Contract(contracts.wellspring, WELLSPRING);
  const wellspringV2 = new Contract(contracts.wellspringV2, WELLSPRING_V2);
  const vpa = new Contract(contracts.votePowerAdapter, VPA);
  const vibesMaticLp = new Contract(contracts.quickswapVibesMatic, QUICKSWAP_PAIR);
  const usdcMaticLp = new Contract(getContracts().quickswapUsdcMatic, QUICKSWAP_PAIR);
  const sqncr = new Contract(contracts.sqncr, SQNCR);

  const calls = [
    vibes.totalSupply(),

    wellspring.reserveBalance(),
    wellspring.tokenCount(),

    vpa.getStrategies(),

    vibes.balanceOf(contracts.gnosisSafe),
    provider.getEthBalance(contracts.gnosisSafe),
    vibesMaticLp.balanceOf(contracts.gnosisSafe),

    sqncr.token(),
    sqncr.mintCost(),
    sqncr.maxMints(),
    sqncr.totalSupply(),

    vibesMaticLp.totalSupply(),
    vibesMaticLp.getReserves(),
    usdcMaticLp.getReserves(),

    wellspringV2.allTokensCount(),
    vibes.balanceOf(contracts.wellspringV2),
  ];

  const resp = await provider.all(calls);
  const [
    vibesTotalSupply,
    wellspringReserveBalance,
    wellspringTokenCount,

    vpsStrategies,

    safeVibesBalance,
    safeMaticBalance,
    safeVibesMaticLpBalance,

    sqncrToken,
    sqncrMintCost,
    sqncrMaxMints,
    sqncrTotalSupply,

    totalVibesMaticLp,
    vibesMaticReserves,
    usdcMaticReserves,

    wellspringV2TokenCount,
    wellspringV2TVL,
  ] = resp;

  const maticReserveUsdc = usdcMaticReserves._reserve0;
  const usdcReserve = usdcMaticReserves._reserve1.mul(BigNumber.from(10).pow(12)); // usdc decimal = 6;
  const maticUsdPrice = usdcReserve.mul(BigNumber.from(10).pow(18)).div(maticReserveUsdc);
  const maticReserveVibes = vibesMaticReserves._reserve0;
  const vibesReserve = vibesMaticReserves._reserve1;
  const vibesMaticPrice = maticReserveVibes.mul(BigNumber.from(10).pow(18)).div(vibesReserve);
  const vibesUsdcPrice = vibesMaticPrice.mul(maticUsdPrice).div(BigNumber.from(10).pow(18));
  const totalLiquidityUsdc = vibesUsdcPrice.mul(vibesReserve).mul(2).div(BigNumber.from(10).pow(18));
  const vibesMaticLpUsdcPrice = totalLiquidityUsdc.mul(BigNumber.from(10).pow(18)).div(totalVibesMaticLp);

  const view: ProtocolView = {
    vibesToken: {
      address: contracts.vibes,
      totalSupply: vibesTotalSupply,
    },
    wellspring: {
      address: contracts.wellspring,
      reserveVibesBalance: wellspringReserveBalance,
      tokenCount: wellspringTokenCount.toNumber(),
    },
    wellspringV2: {
      address: contracts.wellspringV2,
      tokenCount: wellspringV2TokenCount.toNumber(),
      totalVibesLocked: wellspringV2TVL,
    },
    gnosisSafe: {
      address: contracts.gnosisSafe,
      vibesBalance: safeVibesBalance,
      maticBalance: safeMaticBalance,
      vibesMaticLpBalance: safeVibesMaticLpBalance,
    },
    sqncr: {
      address: contracts.sqncr,
      maxMints: sqncrMaxMints.toNumber(),
      mintCost: sqncrMintCost,
      tokenAddress: sqncrToken,
      totalMinted: sqncrTotalSupply.toNumber(),
    },
    votePowerAdapter: {
      address: contracts.votePowerAdapter,
      strategies: vpsStrategies,
    },
    quickswap: {
      maticUsdcPrice: maticUsdPrice,
      vibesMaticPrice,
      vibesUsdcPrice,
      vibesMaticLpUsdcPrice,
      vibesMaticPool: {
        address: contracts.quickswapVibesMatic,
        totalSupply: totalVibesMaticLp,
        maticReserve: maticReserveVibes,
        vibesReserve: vibesReserve,
        totalLiquidityUsdc,
      },
    },
  };

  return view;
};
