import { getContracts } from '../../../site-vibes/src/lib/contracts';
import { NFTView } from '../web3/wellspringv2';
import { fetchIpfsJson } from './ipfs';

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export const resolveMetadata = async (uri: string): Promise<Metadata> => {
  // base64 encoded
  if (uri.match(/^data:application\/json;/)) {
    return parseBase64MetadataUri(uri);
  }

  // ipfs-style
  const match = uri.match(/ipfs\/(.*)$/);
  if (match) {
    return fetchIpfsJson(match[1]);
  }

  throw new Error('cannot resolve metadata');
};

export const parseBase64MetadataUri = (uri: string): Metadata => {
  const [, encoded] = uri.match(/^data:application\/json;base64,(.*)$/) ?? [];
  const payload = JSON.parse(atob(encoded));
  return { ...payload, attributes: payload.attribues ?? [] };
};

export const resolveCreator = async (token: NFTView, metadata: Metadata): Promise<string | null> => {
  if (token.nft === getContracts().ssw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (metadata as any)['creator'];
  }
  return null;
};

export interface MediaInfo {
  mimeType: string;
  size: number;
}

export const resolveMediaInfo = async (token: NFTView, metadata: Metadata): Promise<MediaInfo | null> => {
  if (token.nft === getContracts().ssw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (metadata as any)['media'];
  }
  return null;
};
