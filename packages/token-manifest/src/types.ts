import { TokenData } from '@bvalosek/lib-tokens';

/** standard metadata information */
export interface Metadata {
  name: string;
  description: string;
  image: string;
}

/**
 * datatype that serves as the "source" for token information, that will be
 * processed and transformed
 */
export interface TokenSource {
  token: TokenData;
  summary?: string;
  metadata: Metadata[];
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
}

/** source information for a collection */
export interface CollectionSource {
  name: string;
  description: string;
  image: string;
  externalLink: string;
  version: number;
}

/** actual metadata payload for the collectionURI method */
export interface CollectionMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
}

/** generated metadata content + corresponding IPFS CID */
interface MetadataEntry {
  cid: string;
  content: TokenMetadata;
}

/** roles up all the information sourced and generated for a specific token */
export interface TokenManifestEntry {
  id: string;
  source: TokenSource;
  metadata: MetadataEntry[];
}

/** information about a sequence written as data */
export interface SequenceManifestEntry {
  number: number;
  source: SequenceSource;
  imageCID: string;
}

/** information about a collection written as data */
export interface CollectionManifestEntry {
  version: number;
  source: CollectionSource;
  content: CollectionMetadata;
  cid: string;
}
