export const fetchIpfsJson = async <T>(hash: string): Promise<T> => {
  const resp = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
  const json = await resp.json();
  return json;
};

export const ipfsGatewayUrl = (ipfsUrl: string): string => {
  const match = ipfsUrl.match(/\/ipfs\/(.*)$/);
  if (!match) throw new Error();
  const [, hash] = match;
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
