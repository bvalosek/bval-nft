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

/** The actual metadata that will be generated for each token */
export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  token_id: string;
  edition_number: number;
  edition_total: number;
}

/** roles up all the information sourced and generated to a specific token */
export interface TokenManifestEntry {
  source: TokenSource;
  mintData: TokenMintData;
  metadata: TokenMetadata;
  metadataCID: string;
}

export interface SequenceManifestEntry {
  source: SequenceSource;
  createData: SequenceCreateData;
}
