import memoize from 'lodash/memoize';

export const fetchIpfsJson = memoize(
  async <T>(hash: string): Promise<T> => {
    const resp = await fetch(`https://ipfs.io/ipfs/${hash}`);
    const json = await resp.json();
    return json;
  }
);

export const ipfsGatewayUrl = (ipfsUrl: string): string => {
  const match = ipfsUrl.match(/\/ipfs\/(.*)$/);
  if (!match) throw new Error();
  const [, hash] = match;
  return `https://ipfs.io/ipfs/${hash}`;
};
