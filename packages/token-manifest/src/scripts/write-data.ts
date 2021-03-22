// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { writeFileSync } from 'fs';
import { join } from 'path';

import { tokens, sequences } from '../tokens';
import { getAllPins, unpin, uploadFromDisk, uploadJSON } from '../pinata';
import { generateTokenMetadata } from '../metadata';
import { TokenManifestEntry } from '../types';
import { createToken, toHexStringBytes } from '@bvalosek/lib-tokens';

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const PROJECT_TAG = 'bval-nft';

const writeData = async () => {
  const entries: TokenManifestEntry[] = [];

  // a map from a "name" to the CID
  const cidMap = new Map<string, string>();

  // generate all token metadata json and upload to IPFS
  for (const source of tokens) {
    // resolve sequence
    const sequence = sequences.find((s) => s.sequenceNumber === source.token.sequenceNumber);
    if (!sequence) {
      throw new Error();
    }

    const entry: TokenManifestEntry = {
      tokenId: toHexStringBytes(createToken(source.token), 32),
      metadata: [],
      source,
    };

    // upload each variation of metadata
    for (const [idx, meta] of source.metadata.entries()) {
      // upload the primary asset to IPFS
      const filename = assetPath(meta.image);
      const assetName = `${meta.image}`;
      console.log(`uploading ${assetName} to IPFS...`);
      const { IpfsHash: assetCID } = await uploadFromDisk(filename, { name: assetName, tag: PROJECT_TAG });
      cidMap.set(assetName, assetCID);

      // generate and upload the metadata to IPFS
      const metadata = generateTokenMetadata(source, sequence, idx, assetCID);
      const metadataName = `${metadata.token_id}.json[${idx}]`;
      console.log(`uploading ${metadataName} metadata to IPFS...`);
      const { IpfsHash: metadataCID } = await uploadJSON(metadata, { name: metadataName, tag: PROJECT_TAG });
      cidMap.set(metadataName, metadataCID);

      entry.metadata.push({ content: metadata, cid: metadataCID });
    }
    entries.push(entry);
  }

  // find all extra pinned files that we can now unpin
  const existing = await getAllPins(PROJECT_TAG);
  console.log('checking for outdated pins...');
  for (const pinned of existing) {
    const { name = '' } = pinned.metadata;
    const uploaded = cidMap.get(name);
    if (uploaded !== pinned.ipfs_pin_hash) {
      console.log(`unpinning out of date hash for ${name}: ${pinned.ipfs_pin_hash}`);
      await unpin(pinned.ipfs_pin_hash);
    }
  }

  writeFileSync(join(__dirname, '../../data', 'tokens.json'), JSON.stringify(entries, null, 2));
};

writeData();
