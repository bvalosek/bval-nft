import { useStaticQuery, graphql } from 'gatsby';
import { UseTokensQueryQuery } from '../../graphql-types';

export type GatsbyTokenData = UseTokensQueryQuery['tokens']['nodes'][0];

export type GatsbySequenceData = NonNullable<GatsbyTokenData['sequence']>;

interface ContractAddresses {
  token: string;
  collection: string;
}

/** get the contract addresses. eventually should switch on chainId */
export const useContractAddresses = (): ContractAddresses => {
  return {
    token: '0x27525344bbba0dDb182251387AEdd0Bde7d466B2',
    collection: '0x02D91986F0C2B02830bDfC022f0dA83529B78334',
  };
};

/** get access to all token data */
export const useTokens = (): GatsbyTokenData[] => {
  const data: UseTokensQueryQuery = useStaticQuery(graphql`
    query UseTokensQuery {
      tokens: allToken {
        nodes {
          tokenId
          slug
          source {
            name
            description
            token {
              assetType
              height
              width
              minted
              created
              editionTotal
              editionNumber
              tokenNumber
              input
              output
            }
          }
          sequence {
            sequenceNumber
            slug
            source {
              name
              description
              completed
              atomic
            }
            collection {
              collectionVersion
              source {
                name
                description
              }
              remoteImage {
                ...FluidImage
              }
            }
            remoteImage {
              ...FluidImage
            }
            socialImage: remoteImage {
              ...SocialImage
            }
          }
          metadata {
            ipfsGatewayUrl
            content {
              image
            }
            assets {
              name
              ipfsGatewayUrl
              ipfsUri
            }
            remoteImage {
              ...FluidImage
            }
            socialImage: remoteImage {
              ...SocialImage
            }
          }
        }
      }
    }

    fragment FluidImage on File {
      childImageSharp {
        fluid(maxWidth: 1600, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }

    fragment SocialImage on File {
      childImageSharp {
        resize(toFormat: PNG, quality: 100, width: 1200, height: 628, fit: CONTAIN) {
          src
        }
      }
    }
  `);

  return data.tokens.nodes;
};

/** given token data, extract the default metadata */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const defaultMetadata = (token: GatsbyTokenData) => {
  const metadata = token.metadata?.[0];
  if (!metadata) {
    throw new Error();
  }
  return metadata;
};
