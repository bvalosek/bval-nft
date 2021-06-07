import { getContracts } from './contracts';
import { VIBES_WELLSPRING } from '@bvalosek/solidity-contracts';
import { BigNumber, Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { currentTimestamp, toHexStringBytes } from './web3';
import { asDecimal } from './numbers';

export interface TokenInfo {
  tokenId: string;
  owner: string;
  seedTimestamp: number;
  dailyRate: BigNumber;
  balance: BigNumber;
  claimable: string;
  lastClaimAt: number;
  isBurnt: boolean;
  totalClaimed: BigNumber;
  totalGenerated: BigNumber;
}

export interface TokenStats {
  totalBalance: BigNumber;
  totalClaimable: BigNumber;
  totalClaimed: BigNumber;
  totalGenerated: BigNumber;
  totalDailyRate: BigNumber;
}

export const computeStats = (tokens: TokenInfo[]): TokenStats => {
  const totalBalance = tokens.reduce((acc, token) => acc.add(token.balance), BigNumber.from(0));
  const totalClaimable = tokens.reduce((acc, token) => acc.add(token.claimable), BigNumber.from(0));
  const totalClaimed = tokens.reduce((acc, token) => acc.add(token.totalClaimed), BigNumber.from(0));
  const totalGenerated = tokens.reduce((acc, token) => acc.add(token.totalGenerated), BigNumber.from(0));
  const totalDailyRate = tokens.reduce((acc, token) => acc.add(token.dailyRate), BigNumber.from(0));
  return { totalBalance, totalClaimable, totalClaimed, totalGenerated, totalDailyRate };
};

export const getTokenCount = async (provider: JsonRpcProvider): Promise<number> => {
  const faucet = new Contract(getContracts().faucetV2, VIBES_WELLSPRING.abi, provider);
  const count = await faucet.tokenCount();
  return count.toNumber();
};

export const getTokenInfoByIndex = async (provider: JsonRpcProvider, index: number): Promise<TokenInfo> => {
  const faucet = new Contract(getContracts().faucetV2, VIBES_WELLSPRING.abi, provider);
  const tokenId = await faucet.tokenIdAt(index);
  const info = await faucet.tokenInfo(tokenId);
  const now = currentTimestamp();

  const seedTimestamp = info.seedTimestamp.toNumber();
  const secondsAlive = now - seedTimestamp;
  const totalGenerated = info.dailyRate.mul(secondsAlive).div(60 * 60 * 24);
  const totalClaimed = totalGenerated.sub(info.claimable);

  const projected: TokenInfo = {
    tokenId: info.tokenId.toString(),
    owner: toHexStringBytes(info.owner, 20),
    dailyRate: info.dailyRate,
    balance: info.balance,
    claimable: info.claimable,
    lastClaimAt: info.lastClaimAt.toNumber(),
    isBurnt: info.isBurnt,
    seedTimestamp,
    totalClaimed,
    totalGenerated,
  };

  return projected;
};
