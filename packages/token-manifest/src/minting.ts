import { TokenMintData } from '@bvalosek/lib-tokens';
import { TokenMetadata } from './types';

/** generate the data that should be used to mint tokens */
export const generateTokenMintData = (metadata: TokenMetadata, metadataCID: string): TokenMintData => {
  return {
    tokenId: metadata.token_id,
    name: metadata.name,
    description: metadata.short_description,
    data: JSON.stringify(metadata.data),
    metadataCID,
  };
};
