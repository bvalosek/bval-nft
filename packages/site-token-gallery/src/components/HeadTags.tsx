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

  const { title = metadata.title, description = metadata.description, socialImage } = props;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content={metadata.siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {socialImage && <meta property="og:image" content={absoluteUrl(socialImage.src)} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bvalosek" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content={description} />
      {socialImage && <meta property="twitter:image" content={absoluteUrl(socialImage.src)} />}
    </Helmet>
  );
};
