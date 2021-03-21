import { createToken } from '@bvalosek/lib-tokens';
import { toHexStringBytes } from '@bvalosek/lib-tokens/src/util';
import { TokenMetadata, TokenSource } from './types';

const createSlug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/gi, '-');

export const generateTokenMetadata = (source: TokenSource, assetCid: string): TokenMetadata => {
  const slug = createSlug(source.name);
  const url = `https://tokens.bvalosek.com/tokens/${slug}`;

  const description = `

${source.description}

Edition ${source.token.editionNumber} / ${source.token.editionTotal}

This is token #${source.token.tokenNumber} in the @bvalosek NFT Collection, minted on ${source.token.minted}.

Original File: ${source.token.width} x ${source.token.height} ${source.token.assetType}

To view more information or interact with this NFT, go to:

${url}

`.trim();

  return {
    name: source.name,
    description,
    image: `ipfs://ipfs/${assetCid}`,
    external_url: url,
    token_id: toHexStringBytes(createToken(source.token), 32),
    edition_number: source.token.editionNumber,
    edition_total: source.token.editionTotal,
  };
};
