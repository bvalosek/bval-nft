/* eslint-disable @typescript-eslint/no-var-requires */
const { createRemoteFileNode } = require('gatsby-source-filesystem');

const allTokenData = require('@bvalosek/token-manifest/data/tokens.json');
const allSequenceData = require('@bvalosek/token-manifest/data/sequences.json');
const allCollectionData = require('@bvalosek/token-manifest/data/collections.json');

/** given a uri with the IPFS protocol, return a http URL */
const ipfsGatewayUrl = (ipfsUri) => ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/');

/**
 * gatsby hook to modifiy existing inferred graph types
 */
exports.createSchemaCustomization = ({ actions, schema }) => {
  // we only need to define fields that extend the inferred set of fields that
  // are created in the sourceNodes hook below
  const TokenType = schema.buildObjectType({
    name: 'Token',
    fields: {
      metadata: {
        type: '[Metadata]',
        // in sourceNodes, we set metadata to an array of metadata node IDs.
        // this will "hydrate" those IDs in the entire node
        resolve(source, args, context) {
          return context.nodeModel.getNodesByIds({ ids: source.metadata, type: 'Metadata' });
        },
      },
    },
    interfaces: ['Node'],
  });

  actions.createTypes([TokenType]);
};

/**
 * gatsby hook used to create nodes from external data sources (in this case,
 * the data files from the token manifest)
 */
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, getCache }) => {
  const sequenceNodeId = (number) => createNodeId(`sequence ${number}`);
  const collectionNodeId = (version) => createNodeId(`collection ${version}`);

  for (const token of allTokenData) {
    // create all metadata nodes for this token
    const metadataNodeIds = [];
    for (const metadata of token.metadata) {
      const id = createNodeId(`metadata ${metadata.cid}`);
      metadataNodeIds.push(id);

      // create a "remote file node" referencing the IPFS image so we can
      // leverage all the image processing gatsy stuff for each metadata node
      const imageNode = await createRemoteFileNode({
        url: ipfsGatewayUrl(metadata.content.image),
        getCache,
        createNode: actions.createNode,
        createNodeId,
        parentNodeId: id,
      });

      actions.createNode({
        id,
        cid: metadata.cid,
        content: metadata.content,
        remoteImage___NODE: imageNode.id,
        internal: {
          type: 'Metadata',
          contentDigest: createContentDigest(JSON.stringify(metadata)),
        },
      });
    }

    // create the actual token node
    actions.createNode({
      id: createNodeId(token.tokenId),
      tokenId: token.tokenId,
      tokenPayload: token.source.token,
      name: token.source.name,
      slug: token.slug,
      metadata: metadataNodeIds,
      sequence___NODE: sequenceNodeId(token.source.token.sequenceNumber),
      internal: {
        type: 'Token',
        contentDigest: createContentDigest(JSON.stringify(token)),
      },
    });
  }

  // create all sequences
  for (const seq of allSequenceData) {
    const id = sequenceNodeId(seq.sequenceNumber);

    const imageNode = await createRemoteFileNode({
      url: ipfsGatewayUrl(`ipfs://ipfs/${seq.imageCID}`),
      getCache,
      createNode: actions.createNode,
      createNodeId,
      parentNodeId: id,
    });

    actions.createNode({
      id,
      ...seq,
      collection___NODE: collectionNodeId(seq.source.collectionVersion),
      remoteImage___NODE: imageNode.id,
      internal: {
        type: 'Sequence',
        contentDigest: createContentDigest(JSON.stringify(seq)),
      },
    });
  }

  // create all collections
  for (const collection of allCollectionData) {
    const id = collectionNodeId(collection.collectionVersion);

    const imageNode = await createRemoteFileNode({
      url: ipfsGatewayUrl(collection.content.image),
      getCache,
      createNode: actions.createNode,
      createNodeId,
      parentNodeId: id,
    });

    actions.createNode({
      id,
      ...collection,
      remoteImage___NODE: imageNode.id,
      internal: {
        type: 'Collection',
        contentDigest: createContentDigest(JSON.stringify(collection)),
      },
    });
  }
};
