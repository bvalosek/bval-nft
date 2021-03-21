// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { tokens, sequences } from '../tokens';
import { join } from 'path';
import { getAllPins, unpin, uploadFromDisk, uploadJSON } from '../pinata';
import { generateTokenMetadata } from '../metadata';
import { TokenManifestEntry } from '../types';
import { generateTokenMintData } from '../minting';

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const writeData = async () => {
  // a map from a "name" to the CID
  const cidMap = new Map<string, string>();

  // upload all assets to IPFS
  const assetNames = [...tokens.map((t) => t.image), ...sequences.map((s) => s.image)];
  for (const name of assetNames) {
    const filename = assetPath(name);
    console.log(`uploading ${name} to IPFS...`);
    const resp = await uploadFromDisk(filename, { name, tag: 'bval-nft' });
    cidMap.set(name, resp.IpfsHash);
  }

  // generate all token metadata json and upload to IPFS
  for (const source of tokens) {
    const cid = cidMap.get(source.image);
    const sequence = sequences.find((s) => s.sequenceNumber === source.token.sequenceNumber);
    if (!sequence || !cid) {
      throw new Error();
    }
    const metadata = generateTokenMetadata(source, sequence, cid);
    const name = `${metadata.token_id}.json`;

    console.log(`uploading ${source.name} metadata to IPFS...`);
    const resp = await uploadJSON(metadata, { name, tag: 'bval-nft' });
    const metadataCID = resp.IpfsHash;
    cidMap.set(name, metadataCID);
    // const mintData = generateTokenMintData(metadata, metadataCID);
    // const entry: TokenManifestEntry = {
    //   metadata,
    //   source,
    //   mintData,
    //   metadataCID,
    // };
  }

  // find all extra pinned files that we can now unpin
  const existing = await getAllPins('bval-nft');
  console.log('checking for outdated pins...');
  for (const pinned of existing) {
    const { name = '' } = pinned.metadata;
    const uploaded = cidMap.get(name);
    if (uploaded !== pinned.ipfs_pin_hash) {
      console.log(`removing old hash ${pinned.ipfs_pin_hash}`);
      await unpin(pinned.ipfs_pin_hash);
    }
  }
};

writeData();
