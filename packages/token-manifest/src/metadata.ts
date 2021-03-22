import { createToken } from '@bvalosek/lib-tokens';
import { toHexStringBytes } from '@bvalosek/lib-tokens/src/util';
import { MarketplaceAttribute, SequenceSource, TokenMetadata, TokenSource } from './types';

const createSlug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/gi, '-');

/** create the ERC721Metadata spec compat metadata information for a given token */
export const generateTokenMetadata = (
  source: TokenSource,
  sequence: SequenceSource,
  metadataIndex: number,
  assetCid: string
): TokenMetadata => {
  const metadata = source.metadata[metadataIndex];
  const slug = createSlug(metadata.name);
  const url = `https://tokens.bvalosek.com/tokens/${slug}`;

  const attributes: MarketplaceAttribute[] = [
    { trait_type: 'Sequence', value: sequence.name },
    { trait_type: 'Token Number', value: `#${source.token.tokenNumber}` },
    { trait_type: 'Created', value: `${source.token.created}` },
    { trait_type: 'Minted', value: `${source.token.minted}` },
    { trait_type: 'Edition', value: `${source.token.editionNumber} / ${source.token.editionTotal}` },
    { trait_type: 'Dimensions', value: `${source.token.width} ✕ ${source.token.height}` },
    { trait_type: 'File Type', value: `${source.token.assetType}` },
  ];

  const atomic = sequence.atomic
    ? `

"${sequence.name}" is an atomic sequence-- all tokens for this sequence were minted (and the sequence was completed) in a single Ethereum transaction. New NFTs cannot be minted for completed sequences.`
    : '';

  const description = `

${metadata.description}${source.summary ? '\n\n' + `${source.summary}` : ''}

Edition ${source.token.editionNumber} / ${source.token.editionTotal}

This is token #${source.token.tokenNumber} in the @bvalosek NFT Collection, minted on ${
    source.token.minted
  }. It is part of the "${sequence.name}" sequence.${atomic}

Original File: ${source.token.width} ✕ ${source.token.height} ${source.token.assetType}, created ${source.token.created}

To view more information or interact with this NFT, go to:

${url}

`.trim();

  return {
    name: metadata.name,
    slug,
    description,
    image: `ipfs://ipfs/${assetCid}`,
    external_url: url,
    token_id: toHexStringBytes(createToken(source.token), 32),
    edition_number: source.token.editionNumber,
    edition_total: source.token.editionTotal,
    short_description: metadata.description,
    attributes,
  };
};
