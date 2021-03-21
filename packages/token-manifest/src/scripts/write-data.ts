// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { tokens, sequences } from '../tokens';
import { join } from 'path';
import { uploadFromDisk, uploadJSON } from '../pinata';
import { generateTokenMetadata } from '../metadata';
import { TokenManifestEntry } from '../types';

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const writeData = async () => {
  // upload all assets to IPFS and create a CID lookup map
  const cidMap = new Map<string, string>();
  const assetNames = [...tokens.map((t) => t.image), ...sequences.map((s) => s.image)];
  for (const name of assetNames) {
    const filename = assetPath(name);
    console.log(`uploading ${name} to IPFS...`);
    const resp = await uploadFromDisk(filename, { name, tag: 'bval-nft' });
    cidMap.set(name, resp.IpfsHash);
  }

  // generate all token metadata json
  for (const token of tokens) {
    const cid = cidMap.get(token.image);
    if (!cid) {
      throw new Error();
    }
    const metadata = generateTokenMetadata(token, cid);
    console.log(`uploading ${token.name} metadata to IPFS...`);
    await uploadJSON(metadata, { name: `${metadata.token_id}.json`, tag: 'bval-nft' });
  }

  // const cids = await computeCIDs(assetFilenames);
  // console.log(cids);
  // const compiled = tokens.map((t) => {
  //   const token = createToken(t.token);
  //   const assetFilename = assetPath(t.image);
  //   console.log(assetFilename);
  // });
  // console.log(resp);
};

writeData();
