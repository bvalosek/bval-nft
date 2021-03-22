import { createToken, parseToken } from './token';
import { TokenData } from './types';
import { toHexStringBytes } from './util';

const createData = (): TokenData => {
  return {
    version: 1,
    collectionNumber: 1,
    sequenceNumber: 1,
    tokenNumber: 1,
    minted: '2021-03-21',
    created: '2020-12-01',
    editionNumber: 1,
    editionTotal: 1,
    assetType: 'PNG',
    width: 2400,
    height: 2400,
  };
};

describe('token encoding', () => {
  it('should encode at token', () => {
    const token = createToken({ ...createData() });
    expect(toHexStringBytes(token)).toMatchInlineSnapshot(
      `"0x01bc00010001491348a500010001010960096000000000000000000000000001"`
    );
  });
  it('should throw if token version is not 1', () => {
    const task = () => createToken({ ...createData(), version: 2 });
    expect(task).toThrow('invalid token version');
  });
});

describe('token parsing', () => {
  it('should parse an encoded token', () => {
    const data: TokenData = {
      version: 1,
      collectionNumber: 3451,
      sequenceNumber: 3534,
      tokenNumber: 34151,
      minted: '2021-03-21',
      created: '2020-12-01',
      editionNumber: 173,
      editionTotal: 500,
      assetType: 'PNG',
      width: 8000,
      height: 6000,
    };
    const token = createToken(data);
    expect(parseToken(token)).toEqual(data);
  });
  it('should throw on a malformed token', () => {
    const task = () => parseToken(123);
    expect(task).toThrow('malformed token');
  });
});
