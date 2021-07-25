import { Contract, Provider } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import VIBES from './abi/vibes.json';
import VOTE_POWER_ADAPTER from './abi/vote-power-adapater.json';
import QUICKSWAP_PAIR from './abi/quickswap-pair.json';
import SQNCR from './abi/sqncr.json';
import { BigNumber } from 'ethers';
import { getSQNCRView, SQNCRData } from './sqncr';

export interface AccountView {
  address: string;
  votePower: BigNumber;
  maticBalance: BigNumber;
  vibesBalance: BigNumber;
  vibesMaticLpBalance: BigNumber;
  /** as a 18-decimal percent */
  shareOfVibesMaticLpPool: BigNumber;
  lpUnderlyingVibes: BigNumber;
  lpUnderlyingMatic: BigNumber;
  sqncrs: SQNCRData[];
  mintedSQNCRs: number;
  maxMints: number;
}

export const getAccountView = async (address: string): Promise<AccountView> => {
  const provider = new Provider(getProvider(), 137);
  const vibes = new Contract(getContracts().vibes, VIBES);
  const vpa = new Contract(getContracts().votePowerAdapter, VOTE_POWER_ADAPTER);
  const quickswap = new Contract(getContracts().quickswapVibesMatic, QUICKSWAP_PAIR);
  const sqncr = new Contract(getContracts().sqncr, SQNCR);

  const calls = [
    vpa.getVotePower(address),
    provider.getEthBalance(address),
    vibes.balanceOf(address),
    quickswap.balanceOf(address),
    quickswap.totalSupply(),
    quickswap.getReserves(),
    sqncr.balanceOf(address),
    sqncr.mintCountByAddress(address),
    sqncr.maxMints(),
  ];

  const resp = await provider.all(calls);

  const vibesMaticLpBalance = resp[3];
  const vibesMaticLpTotalSupply = resp[4];
  const { _reserve0: maticReserve, _reserve1: vibesReserve } = resp[5];
  const shareOfVibesMaticLpPool = vibesMaticLpBalance.mul(BigNumber.from(10).pow(18)).div(vibesMaticLpTotalSupply);
  const lpUnderlyingVibes = vibesReserve.mul(shareOfVibesMaticLpPool).div(BigNumber.from(10).pow(18));
  const lpUnderlyingMatic = maticReserve.mul(shareOfVibesMaticLpPool).div(BigNumber.from(10).pow(18));
  const ownedSQNCRs = resp[6].toNumber();
  const mintedSQNCRs = resp[7].toNumber();

  const toobi = [...new Array(ownedSQNCRs)].map((_, idx) => sqncr.tokenOfOwnerByIndex(address, idx));
  const sqncrIds = await provider.all(toobi);

  const sqncrs = await getSQNCRView(sqncrIds);

  const view: AccountView = {
    address,
    votePower: resp[0],
    maticBalance: resp[1],
    vibesBalance: resp[2],
    vibesMaticLpBalance,
    shareOfVibesMaticLpPool,
    lpUnderlyingVibes,
    lpUnderlyingMatic,
    sqncrs: sqncrs.map((v) => v.sqncr),
    mintedSQNCRs,
    maxMints: resp[8].toNumber(),
  };

  return view;
};
