import { assetTypeIndex, assetTypeName } from './asset-types';
import { parseDate, serializeDate } from './date';
import { TokenData } from './types';
import { assert, BigNumber, bytes, keccak256, Numberish, toBN, toHexStringBytes, toUint } from './util';

/** generate a token */
export const createToken = (tokenData: TokenData): BigNumber => {
  // only support version = 1 for now, this lets us have alternative parsing
  // schemes later down the line. Any on-chain expectations around token ID
  // encoding must stay the same across token versions
  assert(tokenData.version === 1, 'invalid token version');

  let token = toBN(0);

  // add in encoded token data
  token = token.or(toUint(tokenData.version, 1, 'version').shl(bytes(31)));
  token = token.or(toUint(tokenData.collectionNumber, 2, 'collectionNumber').shl(bytes(28)));
  token = token.or(toUint(tokenData.sequenceNumber, 2, 'sequenceNumber').shl(bytes(26)));
  token = token.or(serializeDate(tokenData.minted).shl(bytes(24)));
  token = token.or(serializeDate(tokenData.created).shl(bytes(22)));
  token = token.or(toUint(tokenData.editionNumber, 2, 'editionNumber').shl(bytes(20)));
  token = token.or(toUint(tokenData.editionTotal, 2, 'editionTotal').shl(bytes(18)));
  token = token.or(toBN(assetTypeIndex(tokenData.assetType)).shl(bytes(17)));
  token = token.or(toUint(tokenData.width, 2, 'width').shl(bytes(15)));
  token = token.or(toUint(tokenData.height, 2, 'height').shl(bytes(13)));
  token = token.or(toUint(tokenData.output, 2, 'output').shl(bytes(11)));
  token = token.or(toUint(tokenData.input, 2, 'input').shl(bytes(9)));

  // token number is last
  token = token.or(toUint(tokenData.tokenNumber, 2, 'tokenNumber').shl(bytes(0)));

  // add in checksum
  const checksum = keccak256(toHexStringBytes(token)).mask(bytes(1));
  token = token.or(checksum.shl(bytes(30)));

  // sanity check
  assert(isTokenValid(token), 'generated token is not valid');

  return token;
};

/** parse a token */
export const parseToken = (token: Numberish): TokenData => {
  const t = toBN(token);
  assert(isTokenValid(t), 'malformed token');
  const version = t.shr(bytes(31)).mask(bytes(1)).toNumber();
  assert(version === 1, 'invalid token version');
  const collectionNumber = t.shr(bytes(28)).mask(bytes(2)).toNumber();
  const sequenceNumber = t.shr(bytes(26)).mask(bytes(2)).toNumber();
  const minted = parseDate(t.shr(bytes(24)).mask(bytes(2)));
  const created = parseDate(t.shr(bytes(22)).mask(bytes(2)));
  const editionNumber = t.shr(bytes(20)).mask(bytes(2)).toNumber();
  const editionTotal = t.shr(bytes(18)).mask(bytes(2)).toNumber();
  const assetType = assetTypeName(t.shr(bytes(17)).mask(bytes(1)).toNumber());
  const width = t.shr(bytes(15)).mask(bytes(2)).toNumber();
  const height = t.shr(bytes(13)).mask(bytes(2)).toNumber();
  const output = t.shr(bytes(11)).mask(bytes(2)).toNumber();
  const input = t.shr(bytes(9)).mask(bytes(2)).toNumber();
  const tokenNumber = t.shr(bytes(0)).mask(bytes(2)).toNumber();

  return {
    version,
    collectionNumber,
    sequenceNumber,
    tokenNumber,
    minted,
    created,
    editionNumber,
    editionTotal,
    assetType,
    width,
    height,
    output,
    input,
  };
};

const checksumMask = toBN('0xff00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

/** returns true if token has valid checksum */
const isTokenValid = (token: BigNumber): boolean => {
  const checksum = token.shr(bytes(30)).mask(bytes(1));
  const masked = token.and(checksumMask);
  const computed = keccak256(masked).mask(8);
  return computed.eq(checksum);
};
