const domain = 'https://us-central1-proofoftwitter.cloudfunctions.net';

export const resolveTwitterId = async (address: string): Promise<string> => {
  const resp = await fetch(`${domain}/api/user/?address=${address}`);
  const json = await resp.json();
  return json.twitterId;
};
