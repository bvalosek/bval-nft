/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BigNumber, Contract, ContractTransaction, Signer } from 'ethers';
import { getContracts } from './contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import VIBES from '@bvalosek/solidity-contracts/deployed-contracts/VIBES-2021-06-05.json';

export const getTokenBalance = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const vibes = new Contract(getContracts().vibes, VIBES.abi, provider);
  const balance = await vibes.balanceOf(address);
  return balance;
};

export const sendVibes = async (signer: Signer, address: string, amount: BigNumber): Promise<ContractTransaction> => {
  const vibes = new Contract(getContracts().vibes, VIBES.abi, signer);
  const trx = await vibes.transfer(address, amount);
  return trx;
};

export const addToMetamask = async (provider: any): Promise<void> => {
  await provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: { address: getContracts().vibes, symbol: 'VIBES', decimals: 18 },
    },
  });
};

export const vibesAmount = (amount: number): BigNumber => BigNumber.from(10).pow(18).mul(amount);
