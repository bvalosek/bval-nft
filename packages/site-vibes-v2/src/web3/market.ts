import { Contract, Provider } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import QUICKSWAP_PAIR from './abi/quickswap-pair.json';
import { BigNumber } from 'ethers';

export interface MarketView {
  maticUsdcPrice: BigNumber;
  vibesMaticPrice: BigNumber;
  vibesUsdcPrice: BigNumber;
  vibesMaticPool: {
    totalSupply: BigNumber;
    vibesReserve: BigNumber;
    maticReserve: BigNumber;
  };
}

export const getMarketView = async (): Promise<MarketView> => {
  const provider = new Provider(getProvider(), 137);
  const quickswap = new Contract(getContracts().quickswapVibesMatic, QUICKSWAP_PAIR);
  const usdcQuickswap = new Contract(getContracts().quickswapUsdcMatic, QUICKSWAP_PAIR);

  const calls = [quickswap.totalSupply(), quickswap.getReserves(), usdcQuickswap.getReserves()];

  const resp = await provider.all(calls);

  const maticReserveUsdc = resp[2]._reserve0;
  const usdcReserve = resp[2]._reserve1.mul(BigNumber.from(10).pow(12)); // usdc decimal = 6;
  const maticUsdPrice = usdcReserve.mul(BigNumber.from(10).pow(18)).div(maticReserveUsdc);

  const maticReserveVibes = resp[1]._reserve0;
  const vibesReserve = resp[1]._reserve1;
  const vibesMaticPrice = maticReserveVibes.mul(BigNumber.from(10).pow(18)).div(vibesReserve);
  const vibesUsdcPrice = vibesMaticPrice.mul(maticUsdPrice).div(BigNumber.from(10).pow(18));

  const view: MarketView = {
    maticUsdcPrice: maticUsdPrice,
    vibesMaticPrice,
    vibesUsdcPrice,
    vibesMaticPool: {
      totalSupply: resp[0],
      maticReserve: maticReserveVibes,
      vibesReserve: vibesReserve,
    },
  };

  return view;
};
