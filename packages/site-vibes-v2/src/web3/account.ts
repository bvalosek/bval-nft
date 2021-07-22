import { Contract, Provider } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import VIBES from './abi/vibes.json';
import VOTE_POWER_ADAPTER from './abi/vote-power-adapater.json';
import FAUCET_V2 from './abi/faucet-v2.json';

export const getAccountView = async (address: string) => {
  const provider = new Provider(getProvider(), 137);
  const vibes = new Contract(getContracts().vibes, VIBES);
  const vpa = new Contract(getContracts().votePowerAdapter, VOTE_POWER_ADAPTER);
  const faucet = new Contract(getContracts().faucetV2, FAUCET_V2);

  const calls = [vibes.balanceOf(address), vpa.getVotePower(address), faucet.tokenIdAt(100)];

  const resp = await provider.all(calls);
  console.log(resp);
};
