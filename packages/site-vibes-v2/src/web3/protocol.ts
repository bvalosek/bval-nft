import { BigNumber } from 'ethers';
import { Contract, Provider } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import VIBES from './abi/vibes.json';
import WELLSPRING from './abi/wellspring.json';
import VPA from './abi/vote-power-adapater.json';
import QUICKSWAP_PAIR from './abi/quickswap-pair.json';
import SQNCR from './abi/sqncr.json';

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
}

export const getProtocolView = async (): Promise<ProtocolView> => {
  const contracts = getContracts();
  const provider = new Provider(getProvider(), 137);
  const vibes = new Contract(contracts.vibes, VIBES);
  const wellspring = new Contract(contracts.wellspring, WELLSPRING);
  const vpa = new Contract(contracts.votePowerAdapter, VPA);
  const vibesMaticLp = new Contract(contracts.quickswapVibesMatic, QUICKSWAP_PAIR);
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
  ] = resp;

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
  };

  return view;
};
