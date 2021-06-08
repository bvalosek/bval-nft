const domain = 'https://us-central1-proofoftwitter.cloudfunctions.net';

/** address -> twitter  */
const _cache = new Map<string, string>();

export const resolveTwitterId = async (address: string): Promise<string | undefined> => {
  // race condition: calling this several times rapidly for the same address
  // will result in unncessary fetches

  const existing = _cache.get(address);
  if (existing) {
    return existing;
  }

  const resp = await fetch(`${domain}/api/user/?address=${address}`);
  const json = await resp.json();
  const { twitterId } = json;

  _cache.set(address, twitterId);
  return twitterId;
};
