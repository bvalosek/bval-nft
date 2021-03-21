import { TokenData } from '@bvalosek/lib-tokens';

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
