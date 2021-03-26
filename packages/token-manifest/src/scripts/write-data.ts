// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { writeFileSync } from 'fs';
import { join } from 'path';

import { tokens, sequences, collections } from '../tokens';
import { getAllPins, unpin, uploadFromDisk, uploadJSON } from '../pinata';
import { generateCollectionMetadata, generateTokenMetadata } from '../metadata';
import { CollectionManifestEntry, SequenceManifestEntry, TokenManifestEntry } from '../types';
import { createToken, toHexStringBytes } from '@bvalosek/lib-tokens';
import { writeResampledImage } from '../images';

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const PROJECT_TAG = 'bval-nft';

const writeData = async () => {
  // a map from a "name" to the CID
  const cidMap = new Map<string, string>();

  // generate all token metadata json and upload to IPFS
  const tokenEntries: TokenManifestEntry[] = [];
  for (const source of tokens) {
    // resolve sequence
    const sequence = sequences.find((s) => s.sequenceNumber === source.token.sequenceNumber);
    if (!sequence) {
      throw new Error();
    }

    const entry: TokenManifestEntry = {
      id: toHexStringBytes(createToken(source.token), 32),
      metadata: [],
      source,
    };

    // upload each variation of metadata
    for (const [idx, meta] of source.metadata.entries()) {
      // upload the primary asset to IPFS
      const assetCID = await uploadAsset(meta.image);
      cidMap.set(meta.image, assetCID);

      // resize and upload to IPFS
      console.log('resampling asset and uploading to ipfs...');
      const resampled = await writeResampledImage(meta.image);
      const resampledName = `${meta.image}-resampled`;
      const { IpfsHash: resampledCID } = await uploadFromDisk(resampled, { name: resampledName, tag: PROJECT_TAG });
      cidMap.set(resampledName, resampledCID);

      // generate and upload the metadata to IPFS
      const metadata = generateTokenMetadata(source, sequence, idx, assetCID, resampledCID);
      const metadataName = `${metadata.token_id}.json[${idx}]`;
      console.log(`uploading ${metadataName} metadata to IPFS...`);
      const { IpfsHash: metadataCID } = await uploadJSON(metadata, { name: metadataName, tag: PROJECT_TAG });
      cidMap.set(metadataName, metadataCID);

      entry.metadata.push({ content: metadata, cid: metadataCID });
    }
    tokenEntries.push(entry);
  }

  // generate all sequence data and ensure assets are uploaded to IPFS
  const sequenceEntries: SequenceManifestEntry[] = [];
  for (const source of sequences) {
    const imageCID = await uploadAsset(source.image);
    cidMap.set(source.image, imageCID);
    sequenceEntries.push({
      number: source.sequenceNumber,
      source,
      imageCID,
    });
  }

  // generate all collection data and ensure its uploaded to IPFS
  const collectionEntries: CollectionManifestEntry[] = [];
  for (const source of collections) {
    const imageCID = await uploadAsset(source.image);
    cidMap.set(source.image, imageCID);
    const metadata = generateCollectionMetadata(source, imageCID);
    const metadataName = `collection-v${source.version}.json`;
    const { IpfsHash: metadataCID } = await uploadJSON(metadata, { name: metadataName, tag: PROJECT_TAG });
    cidMap.set(metadataName, metadataCID);
    collectionEntries.push({
      version: source.version,
      source,
      content: metadata,
      cid: metadataCID,
    });
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

  // write all data to disk
  writeFileSync(join(__dirname, '../../data', 'tokens.json'), JSON.stringify(tokenEntries, null, 2));
  writeFileSync(join(__dirname, '../../data', 'sequences.json'), JSON.stringify(sequenceEntries, null, 2));
  writeFileSync(join(__dirname, '../../data', 'collections.json'), JSON.stringify(collectionEntries, null, 2));
};

/** upload a static asset from the assets/ directory to IPFS and return the CID */
const uploadAsset = async (relativeAssetPath: string) => {
  const filename = assetPath(relativeAssetPath);
  console.log(`uploading ${relativeAssetPath} to IPFS...`);
  const { IpfsHash: cid } = await uploadFromDisk(filename, { name: relativeAssetPath, tag: PROJECT_TAG });
  return cid;
};

writeData();
