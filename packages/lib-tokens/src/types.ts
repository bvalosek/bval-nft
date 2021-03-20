import { AssetType } from './asset-types';

/** data encoded within a token */
export interface TokenData {
  /** uint16, token encoding version */
  version: number;

  /** uint16 */
  collectionNumber: number;

  /** uint16 */
  sequenceNumber: number;

  /** token number */
  tokenNumber: number;

  /** YYYY-MM-DD */
  minted: string;

  /** YYYY-MM-DD */
  created: string;

  /** uint16 */
  editionNumber: number;

  /** uint16 */
  editionTotal: number;

  /** uint16 */
  assetType: AssetType;

  /** uint16 */
  height: number;

  /** uint16 */
  width: number;
}
