import { useStaticQuery, graphql } from 'gatsby';

interface GatsbyTokenNode {
  id: string;
}

// interface TokenData {
//   tokens: GatsbyTokenNode[];
// }

export const useTokens = (): unknown => {
  const data = useStaticQuery(graphql`
    query {
      tokens: allTokensJson {
        nodes {
          id: tokenId
          metadata {
            content {
              image
              localImage {
                id
              }
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
  console.log(data);
};
