export const fetchIpfsJson = async <T>(hash: string): Promise<T> => {
  const resp = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
  const json = await resp.json();
  return json;
};
