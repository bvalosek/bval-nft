import { createSlug } from './strings';
import {
  CollectionMetadata,
  CollectionSource,
  MarketplaceAttribute,
  SequenceSource,
  TokenMetadata,
  TokenSource,
} from './types';

/** create the ERC721Metadata spec compat metadata information for a given token */
export const generateTokenMetadata = (
  source: TokenSource,
  sequence: SequenceSource,
  metadataIndex: number,
  assetCid: string,
  resampledCID: string
): TokenMetadata => {
  const metadata = source.metadata[metadataIndex];
  const url = `https://tokens.bvalosek.com/tokens/${createSlug(source.name)}`;

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

"${sequence.name}" is an atomic sequence-- all tokens in this sequence were minted (and the sequence was completed) in a single Ethereum transaction. New NFTs cannot be minted for completed sequences.`
    : '';

  const description =
    `

"${metadata.description ?? source.description}"${source.summary ? '\n\n' + `${source.summary}` : ''}

This is token #${source.token.tokenNumber} in the @bvalosek NFT Collection. It is part of the "${
      sequence.name
    }" sequence.${atomic}

Edition ${source.token.editionNumber} / ${source.token.editionTotal}, minted ${source.token.minted}.

${source.token.width} ✕ ${source.token.height} ${source.token.assetType}, created ${source.token.created}.

To view detailed information or interact with this NFT, go to:

${url}

`.trim() + '\n\n';

  return {
    name: metadata.name ?? source.name,
    description,
    image: `ipfs://ipfs/${resampledCID}`,
    assets: [
      {
        name: 'Original File',
        asset: `ipfs://ipfs/${assetCid}`,
      },
    ],
    external_url: url,
    edition_number: source.token.editionNumber,
    edition_total: source.token.editionTotal,
    attributes,
  };
};

/** generate the collectionURI metadata */
export const generateCollectionMetadata = (source: CollectionSource, imageCID: string): CollectionMetadata => {
  const metadata: CollectionMetadata = {
    name: source.name,
    description: source.description,
    external_link: source.externalLink,
    image: `ipfs://ipfs/${imageCID}`,
  };

  return metadata;
};
