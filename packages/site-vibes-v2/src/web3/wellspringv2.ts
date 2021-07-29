import { BigNumber } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import WELLSPRING_V2 from './abi/wellspring-v2.json';

interface Token {
  nft: string;
  tokenId: string;
}

export interface NFTView {
  nft: string;
  tokenId: string;
  owner: string;
  tokenUri: string;

  isSeeded: boolean;
  seeder: string;
  operator: string;
  isLegacyToken: boolean;

  dailyRate: BigNumber;
  balance: BigNumber;
  lastClaimAt: number;
  claimable: BigNumber;

  sampledAt: number;
}

export const getNFTDetails = async (tokens: Token[]): Promise<(NFTView | null)[]> => {
  const provider = new Provider(getProvider(), 137);
  const wellspringV2 = new MulticallContract(getContracts().wellspringV2, WELLSPRING_V2);
  const [...views] = await provider.all([...tokens.map((t) => wellspringV2.getToken(t.nft, t.tokenId))]);

  const now = Math.round(Date.now() / 1000);

  const projected = views.map<NFTView | null>((v) => {
    if (!v.isValidToken) return null;
    return {
      nft: v.nft,
      tokenId: v.tokenId.toString(),
      owner: v.owner,
      tokenUri: v.tokenURI,
      isSeeded: v.isSeeded,
      seeder: v.seeder,
      operator: v.operator,
      isLegacyToken: v.isLegacyToken,
      dailyRate: v.dailyRate,
      balance: v.balance,
      lastClaimAt: v.lastClaimAt.toNumber(),
      claimable: v.claimable,
      sampledAt: now,
    };
  });

  return projected;
};
