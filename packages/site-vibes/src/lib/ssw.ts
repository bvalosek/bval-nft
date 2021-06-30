import { Contract, ContractTransaction, Signer } from 'ethers';
import SSW_GALLERY from './abi/ssw-gallery.json';
import { JsonRpcProvider } from '@ethersproject/providers';

// https://github.com/Screensaver-world/Gallery-Contract/blob/main/Gallery.sol
const galleryAddress = '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4';

export interface ScreensaverTokenMetadata {
  name: string;
  description: string;
  tags: string[];
  image: string;
  animation_url?: string;
  creator: string;
  /** iso8601 */
  creationDate: string;
  media: {
    mimeType: string;
    size: number;
  };
}

export const getTokenMetadata = async (
  provider: JsonRpcProvider,
  tokenId: string
): Promise<ScreensaverTokenMetadata> => {
  const ssw = new Contract(galleryAddress, SSW_GALLERY, provider);
  const url = await ssw.tokenURI(tokenId);
  const resp = await fetch(url);
  const json = await resp.json();
  return json;
};

export const cancelBid = async (signer: Signer, tokenId: string): Promise<ContractTransaction> => {
  const ssw = new Contract(galleryAddress, SSW_GALLERY, signer);
  const trx = await ssw.cancelBid(tokenId);
  return trx;
};
