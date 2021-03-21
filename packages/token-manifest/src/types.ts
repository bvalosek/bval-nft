import { SequenceCreateData, TokenData, TokenMintData } from '@bvalosek/lib-tokens';

/**
 * datatype that serves as the "source" for token information, that will be
 * processed and transformed
 */
export interface TokenSource {
  name: string;
  description: string;
  image: string;
  token: TokenData;
}

/** source for sequence information that will be processed and transformed */
export interface SequenceSource {
  name: string;
  sequenceNumber: number;
  collectionNumber: number;
  description: string;
  image: string;
  completed: boolean;
  atomic: boolean;
}

export interface MarketplaceAttribute {
  trait_type: string;
  value: string;
}

/** The actual metadata that will be generated for each token */
export interface TokenMetadata {
  // standard fields
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: MarketplaceAttribute[];

  // rarible fields
  edition_number: number;
  edition_total: number;

  // my fields
  slug: string;
  token_id: string;
  short_description: string;

  /** arbitrary JSON encodeable data */
  data: unknown;
}

/** roles up all the information sourced and generated for a specific token */
export interface TokenManifestEntry {
  tokenId: string;
  source: TokenSource;
  metadata: TokenMetadata;
  metadataCID: string;
}
