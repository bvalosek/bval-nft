import { graphql, useStaticQuery } from 'gatsby';

export interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
}

/** resolve site metadata */
export const useSiteMetadata = (): SiteMetadata => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const { siteMetadata } = data.site;

  return siteMetadata;
};

/** get a function that can be used to create an absolute URL */
export const useAbsoluteUrl = (): { absoluteUrl: (url: string) => string } => {
  const { siteUrl } = useSiteMetadata();

  return {
    absoluteUrl: (url: string) => `${siteUrl}${url}`,
  };
};
