import { BigNumber } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import WELLSPRING_V2 from './abi/wellspring-v2.json';

export interface Token {
  nft: string;
  tokenId: string;
}

export interface NFTView {
  nft: string;
  tokenId: string;

  unlocksAt: number;
  owner: string;
  tokenUri: string;

  seeder: string;
  operator: string;
  seededAt: number;
  dailyRate: BigNumber;
  isLegacyToken: boolean;
  balance: BigNumber;
  lastClaimAt: number;

  claimable: BigNumber;
  isSeeded: boolean;

  sampledAt: number;
  claimed: BigNumber;
  mined: BigNumber;
}

export const nftViewId = (view: Token): string => `${view.nft}:${view.tokenId}`;

export const getNFTDetails = async (tokens: Token[]): Promise<(NFTView | null)[]> => {
  const provider = new Provider(getProvider(), 137);
  const wellspringV2 = new MulticallContract(getContracts().wellspringV2, WELLSPRING_V2);
  const [...views] = await provider.all([...tokens.map((t) => wellspringV2.getToken(t.nft, t.tokenId))]);

  const now = Math.round(Date.now() / 1000);

  const projected = views.map<NFTView | null>((v) => {
    if (!v.isValidToken) return null;

    const mined = BigNumber.from(now)
      .sub(v.seededAt)
      .mul(v.dailyRate)
      .div(60 * 60 * 24);
    const claimed = mined.sub(v.claimable);

    return {
      nft: v.nft,
      tokenId: v.tokenId.toString(),

      unlocksAt: v.unlocksAt.toNumber(),
      owner: v.owner,
      tokenUri: v.tokenURI,

      seeder: v.seeder,
      operator: v.operator,
      seededAt: v.seededAt.toNumber(),
      dailyRate: v.dailyRate,
      isLegacyToken: v.isLegacyToken,
      balance: v.balance,
      lastClaimAt: v.lastClaimAt.toNumber(),

      claimable: v.claimable,
      isSeeded: v.isSeeded,

      sampledAt: now,
      mined,
      claimed,
    };
  });

  return projected;
};

interface RecentTokens {
  limit?: number;
  offset?: number;
  seeder?: string;
}

export const getRecentTokens = async ({ limit = 10, offset = 0, seeder }: RecentTokens = {}): Promise<NFTView[]> => {
  const provider = new Provider(getProvider(), 137);
  const wellspringV2 = new MulticallContract(getContracts().wellspringV2, WELLSPRING_V2);

  // total tokens we have
  const [count] = await provider.all([
    seeder ? wellspringV2.tokensBySeederCount(seeder) : wellspringV2.allTokensCount(),
  ]);

  // create an array of offsets to fetch
  const start = Math.max(0, count.toNumber() - 1 - offset);
  const take = Math.min(limit, start + 1);
  const offsets = [...new Array(take)].map((_, idx) => start - idx);

  // use the offsets to query for the tokenIDs
  const tokens = await provider.all(
    offsets.map((offset) => (seeder ? wellspringV2.tokensBySeeder(seeder, offset) : wellspringV2.allTokens(offset)))
  );

  // fetch deets and filter for null (shouldnt happen, just for narrowing)
  const views = await getNFTDetails(tokens);
  const filtered = views.filter((v): v is NFTView => v !== null);
  if (filtered.length !== views.length) throw new Error();
  return filtered;
};
