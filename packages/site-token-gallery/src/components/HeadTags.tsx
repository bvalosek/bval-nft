import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/site-metadata';

interface Props {
  title?: string;
  description?: string;
}

/** <head> block */
export const HeadTags: FunctionComponent<Props> = (props) => {
  const metadata = useSiteMetadata();

  const { title = metadata.title, description = metadata.description } = props;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content={metadata.siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bvalosek" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content={description} />
    </Helmet>
  );
};
