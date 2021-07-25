import { Contract, BigNumber, ContractTransaction, Signer } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import { parseBase64MetadataUri } from '../lib/strings';
import SQNCR from './abi/sqncr.json';

type SQNCRVariant = 'red' | 'green' | 'blue' | 'purple';

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface SQNCRData {
  tokenId: string;
  creator: string;
  owner: string;
  createdAt: Date;
  seed: BigNumber;
  metadata: Metadata;
  variant: SQNCRVariant;
}

export const mintSQNCR = async (signer: Signer): Promise<ContractTransaction> => {
  const sqncr = new Contract(getContracts().sqncr, SQNCR, signer);
  const trx = await sqncr.mint();
  return trx;
};

export interface SQNCRView {
  sqncr: SQNCRData;
}

export const computeVariant = (tokenId: string, seed: BigNumber): SQNCRVariant => {
  return ['red', 'green', 'blue', 'purple'][seed.mod(4).toNumber()] as SQNCRVariant;
};

export const getVariantName = (variant: SQNCRVariant): string => {
  switch (variant) {
    case 'red':
      return 'FERA';
    case 'green':
      return 'SYNC';
    case 'blue':
      return 'ARC';
    case 'purple':
      return 'ISO';
  }
};

export const getSQNCRView = async (tokenIds: string[]): Promise<SQNCRView[]> => {
  const provider = new Provider(getProvider(), 137);
  const sqncr = new MulticallContract(getContracts().sqncr, SQNCR);
  const [sqncrs, ...tokenURIs] = await provider.all([
    sqncr.batchGetTokenData(tokenIds),
    ...tokenIds.map((id) => sqncr.tokenURI(id)),
  ]);
  const metadata = tokenURIs.map(parseBase64MetadataUri);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sqncrData: SQNCRData[] = sqncrs.map((data: any, idx: number) => {
    const sqncr: SQNCRData = {
      tokenId: data.id.toString(),
      creator: data.creator,
      owner: data.owner,
      createdAt: new Date(data.createdAtTimestamp.toNumber() * 1000),
      seed: data.seed,
      metadata: metadata[idx],
      variant: computeVariant(data.id.toString(), data.seed),
    };

    return sqncr;
  });

  const views = sqncrData.map<SQNCRView>((sqncr) => {
    return { sqncr };
  });

  return views;
};
