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
import { createSlug } from '../strings';

// a lil hacky lol
import existingTokenEntries from '../../data/tokens.json';
import existingSequenceEntries from '../../data/sequences.json';
import existingCollectionEntries from '../../data/collections.json';

const PROJECT_TAG = 'bval-nft';

/**
 * any sequence in here will be updated on token manifest build, even if it
 * already exists in the data files. used during token asset preperation to
 * make my life a lil easier
 */
const LIVE_SEQUENCES: number[] = [3];
const isLiveSequence = (n: number): boolean => LIVE_SEQUENCES.includes(n);

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const dataFilePath = (filename: string): string => join(__dirname, '../../data', filename);

// extract the ipfs hash from a gateway URL
const extractHash = (ipfsGatewayUrl: string): string => ipfsGatewayUrl.replace('ipfs://ipfs/', '');

const writeData = async () => {
  // a map from a "name" to the CID
  const cidMap = new Map<string, string>();

  // generate all token metadata json and upload to IPFS
  const tokenEntries: TokenManifestEntry[] = existingTokenEntries.filter(
    (t) => !isLiveSequence(t.source.token.sequenceNumber)
  ) as TokenManifestEntry[]; // casting as inferred TS type from JSON is lossy;
  for (const source of tokens) {
    if (tokenEntries.find((t) => t.source.token.tokenNumber === source.token.tokenNumber)) {
      console.log(`skipping token ${source.token.tokenNumber}`);
      continue;
    }

    // resolve sequence
    const sequence = sequences.find((s) => s.sequenceNumber === source.token.sequenceNumber);
    if (!sequence) {
      throw new Error();
    }

    const entry: TokenManifestEntry = {
      tokenId: toHexStringBytes(createToken(source.token), 32),
      slug: createSlug(source.name),
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
      const metadataName = `${entry.tokenId}.json[${idx}]`;
      console.log(`uploading ${metadataName} metadata to IPFS...`);
      const { IpfsHash: metadataCID } = await uploadJSON(metadata, { name: metadataName, tag: PROJECT_TAG });
      cidMap.set(metadataName, metadataCID);

      entry.metadata.push({ content: metadata, cid: metadataCID });
    }
    tokenEntries.push(entry);
  }

  // generate all sequence data and ensure assets are uploaded to IPFS
  const sequenceEntries: SequenceManifestEntry[] = existingSequenceEntries.filter(
    (s) => !isLiveSequence(s.sequenceNumber)
  );
  for (const source of sequences) {
    if (sequenceEntries.find((s) => s.sequenceNumber === source.sequenceNumber)) {
      console.log(`skipping sequence ${source.sequenceNumber}`);
      continue;
    }

    const imageCID = await uploadAsset(source.image);
    cidMap.set(source.image, imageCID);
    sequenceEntries.push({
      sequenceNumber: source.sequenceNumber,
      slug: createSlug(source.name),
      source,
      imageCID,
    });
  }

  // generate all collection data and ensure its uploaded to IPFS
  const collectionEntries: CollectionManifestEntry[] = existingCollectionEntries;
  for (const source of collections) {
    if (collectionEntries.find((c) => c.collectionVersion === source.version)) {
      console.log(`skipping collection ${source.version}`);
      continue;
    }

    const imageCID = await uploadAsset(source.image);
    cidMap.set(source.image, imageCID);
    const metadata = generateCollectionMetadata(source, imageCID);
    const metadataName = `collection-v${source.version}.json`;
    const { IpfsHash: metadataCID } = await uploadJSON(metadata, { name: metadataName, tag: PROJECT_TAG });
    cidMap.set(metadataName, metadataCID);
    collectionEntries.push({
      collectionVersion: source.version,
      source,
      content: metadata,
      cid: metadataCID,
    });
  }

  const hashes = [
    ...collectionEntries.map((c) => c.cid),
    ...collectionEntries.map((c) => extractHash(c.content.image)),
    ...sequenceEntries.map((s) => s.imageCID),
    // metadata json cid
    ...tokenEntries.flatMap((t) => t.metadata.map((m) => m.cid)),
    // main image cid (resampled)
    ...tokenEntries.flatMap((t) => t.metadata.map((m) => extractHash(m.content.image))),
    // all assets cids
    ...tokenEntries.flatMap((t) => t.metadata.flatMap((m) => m.content.assets.map((a) => extractHash(a.asset)))),
  ];

  // find all extra pinned files that we can now unpin
  const existing = await getAllPins(PROJECT_TAG);
  const current = new Set(hashes);
  console.log('checking for outdated pins...');
  for (const pinned of existing) {
    const hash = pinned.ipfs_pin_hash;
    if (!current.has(hash)) {
      console.log(`pinned hash not in current list of hashes: ${hash}`);
      await unpin(hash);
    }
  }

  console.log('checking for missing pins');
  for (const expected of hashes) {
    const found = existing.find((p) => p.ipfs_pin_hash === expected);
    if (!found) {
      console.log(`WARNING: pin not found: ${expected}`);
    }
  }

  // write all data to disk
  writeFileSync(dataFilePath('tokens.json'), JSON.stringify(tokenEntries, null, 2));
  writeFileSync(dataFilePath('sequences.json'), JSON.stringify(sequenceEntries, null, 2));
  writeFileSync(dataFilePath('collections.json'), JSON.stringify(collectionEntries, null, 2));
};

/** upload a static asset from the assets/ directory to IPFS and return the CID */
const uploadAsset = async (relativeAssetPath: string) => {
  const filename = assetPath(relativeAssetPath);
  console.log(`uploading ${relativeAssetPath} to IPFS...`);
  const { IpfsHash: cid } = await uploadFromDisk(filename, { name: relativeAssetPath, tag: PROJECT_TAG });
  return cid;
};

writeData();
