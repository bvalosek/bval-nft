/* eslint-disable @typescript-eslint/no-var-requires */

const allTokenData = require('@bvalosek/token-manifest/data/tokens.json');
const allSequenceData = require('@bvalosek/token-manifest/data/sequences.json');
const allCollectionData = require('@bvalosek/token-manifest/data/collections.json');

// const ipfsGatewayUrl = (ipfsUri) => ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud');

/** gatsby plugin to generate nodes from the token data */
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const sequenceNodeId = (number) => createNodeId(`sequence ${number}`);
  const collectionNodeId = (version) => createNodeId(`collection ${version}`);

  // create all tokens
  for (const token of allTokenData) {
    actions.createNode({
      id: createNodeId(token.tokenId),
      ...token,
      slug: createSlug(token.source.metadata[0].name),
      sequence___NODE: sequenceNodeId(token.source.token.sequenceNumber),
      parent: null,
      children: [],
      internal: {
        type: 'Token',
        contentDigest: createContentDigest(JSON.stringify(token)),
      },
    });
  }

  // create all sequences
  for (const seq of allSequenceData) {
    actions.createNode({
      id: sequenceNodeId(seq.sequenceNumber),
      ...seq,
      slug: createSlug(seq.source.name),
      collection___NODE: collectionNodeId(seq.source.collectionVersion),
      parent: null,
      children: [],
      internal: {
        type: 'Sequence',
        contentDigest: createContentDigest(JSON.stringify(seq)),
      },
    });
  }

  // create all collections
  for (const collection of allCollectionData) {
    actions.createNode({
      id: collectionNodeId(collection.collectionVersion),
      ...collection,
      parent: null,
      children: [],
      internal: {
        type: 'Collection',
        contentDigest: createContentDigest(JSON.stringify(collection)),
      },
    });
  }
};
