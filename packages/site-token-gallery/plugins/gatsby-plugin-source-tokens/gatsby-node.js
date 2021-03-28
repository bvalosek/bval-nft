/* eslint-disable @typescript-eslint/no-var-requires */
// const { createRemoteFileNode } = require('gatsby-source-filesystem');

const allTokenData = require('@bvalosek/token-manifest/data/tokens.json');
const allSequenceData = require('@bvalosek/token-manifest/data/sequences.json');
const allCollectionData = require('@bvalosek/token-manifest/data/collections.json');

/** given a uri with the IPFS protocol, return a http URL */
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
