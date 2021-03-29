import { graphql, useStaticQuery } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import { useSiteMetadata, useAbsoluteUrl } from '../hooks/site-metadata';

interface Props {
  title?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socialImage?: any;
}

/** <head> block */
export const HeadTags: FunctionComponent<Props> = (props) => {
  const metadata = useSiteMetadata();
  const { absoluteUrl } = useAbsoluteUrl();
  const resp = useStaticQuery(graphql`
    query DefaultSocialImage {
      file(relativePath: { eq: "social.png" }) {
        id
        # defined in hooks/tokens
        ...SocialImage
      }
    }
  `);

  const { title = metadata.title, description = metadata.description, socialImage } = props;

  const socialImageSrc = socialImage ? absoluteUrl(socialImage.src) : absoluteUrl(resp.file.childImageSharp.resize.src);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content={metadata.siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImageSrc} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bvalosek" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content={description} />
      <meta property="twitter:image" content={socialImageSrc} />
    </Helmet>
  );
};
