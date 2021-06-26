import { getContracts } from './contracts';
import VIBES from '@bvalosek/solidity-contracts/deployed-contracts/VIBES-2021-06-05.json';
import VIBES_WELLSPRING from '@bvalosek/solidity-contracts/deployed-contracts/VIBESWellspring-2021-06-05.json';
import { BigNumber, Contract, Signer, ContractTransaction } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { currentTimestamp, toHexStringBytes } from './web3';

export interface TokenInfo {
  tokenId: string;
  owner: string;
  seedTimestamp: number;
  dailyRate: BigNumber;
  balance: BigNumber;
  claimable: BigNumber;
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
    totalClaimed: totalClaimed.lt(BigNumber.from(10).pow(18)) ? BigNumber.from(0) : totalClaimed,
    totalGenerated,
  };

  return projected;
};

export const cleanupToken = async (signer: Signer, tokenId: string): Promise<void> => {
  const faucet = new Contract(getContracts().faucetV2, VIBES_WELLSPRING.abi, signer);
  const trx = await faucet.cleanup(tokenId);
  console.log(trx);
};

interface Seed {
  tokenId: string;
  dailyRateInWholeVibes: number;
  totalDays: number;
  backdateDays?: number;
}

export const seedToken = async (
  signer: Signer,
  { tokenId, dailyRateInWholeVibes, totalDays, backdateDays = 0 }: Seed
): Promise<void> => {
  const { vibes, faucetV2 } = getContracts();

  const token = new Contract(vibes, VIBES.abi, signer);
  const faucet = new Contract(faucetV2, VIBES_WELLSPRING.abi, signer);

  const allowance = await token.allowance(await signer.getAddress(), faucetV2);
  const rate = `${dailyRateInWholeVibes}000000000000000000`; // lol
  const amount = BigNumber.from(rate).mul(totalDays);

  if (amount.gt(allowance)) {
    const resp = await token.approve(faucetV2, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    console.log(resp);
  }

  const resp = await faucet['seed(uint256,uint256,uint256,uint256)'](tokenId, rate, totalDays, backdateDays);
  console.log(resp);
};

export const claim = async (signer: Signer, tokenId: string, amount?: BigNumber): Promise<ContractTransaction> => {
  const { faucetV2 } = getContracts();
  const faucet = new Contract(faucetV2, VIBES_WELLSPRING.abi, signer);

  const resp = await faucet['claim(uint256,uint256)'](tokenId, amount);
  return resp;
};
