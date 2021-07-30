import { NFTView } from '../web3/wellspringv2';
import { fetchIpfsJson } from './ipfs';
import memoize from 'lodash/memoize';

export interface Metadata {
  name: string;
  description: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  attributes: Array<{ trait_type: string; value: string }>;

  creator?: string;
  media?: {
    mimeType: string;
    size?: number;
  };
}

const cacheKey = (view: NFTView): string => `${view.nft}:${view.tokenId}`;

export const resolveMetadata = memoize(async (view: NFTView): Promise<Metadata> => {
  const uri = view.tokenUri;

  // base64 encoded
  if (uri.match(/^data:application\/json;/)) {
    return parseBase64MetadataUri(uri);
  }

  // ipfs-style
  const match = uri.match(/ipfs\/(.*)$/);
  if (!match) {
    throw new Error('cannot resolve metadata');
  }

  const fetched = await fetchIpfsJson<Metadata>(match[1]);

  return fetched;
}, cacheKey);

const parseBase64MetadataUri = (uri: string): Metadata => {
  const [, encoded] = uri.match(/^data:application\/json;base64,(.*)$/) ?? [];
  const payload = JSON.parse(atob(encoded));
  return { ...payload, attributes: payload.attribues ?? [] };
};
