import { useStaticQuery, graphql } from 'gatsby';
import { UseTokensQueryQuery } from '../../graphql-types';

/** get access to all token data */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTokens = () => {
  const data: UseTokensQueryQuery = useStaticQuery(graphql`
    query UseTokensQuery {
      tokens: allToken {
        nodes {
          name
          slug
          tokenId
          metadata {
            content {
              name
            }
            remoteImage {
              ...FluidImage
            }
          }
        }
      }
    }

    fragment FluidImage on File {
      childImageSharp {
        fluid(maxWidth: 1600, quality: 60) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  `);

  return data.tokens.nodes;
};
