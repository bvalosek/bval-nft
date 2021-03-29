import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
// import { useTokens } from '../hooks/useTokens';
import { ThemeConfig } from '../Theme';
import { PageSection } from './PageSection';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import { Title } from './Title';
import { defaultMetadata, useTokens } from '../hooks/tokens';
// import { TokenDetails } from './TokenDetails';

interface Props {
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        flex: 1,
        padding: theme.scaledSpacing(4),
        maxWidth: '60vh',
        maxHeight: '60vh',
      },
    },
  };
});

export const TokenInfo: FunctionComponent<Props> = (props) => {
  const tokens = useTokens();
  const { tokenId } = props;
  const classes = useStyles();

  const token = tokens.find((t) => t.tokenId === tokenId);
  const metadata = defaultMetadata(token);

  return (
    <>
      <div className={classes.hero}>
        <div>
          <Img fluid={metadata.remoteImage.childImageSharp.fluid} />
        </div>
      </div>
      <PageSection>
        <Title
          title={token.source.name}
          subtitle={token.source.description}
          vibe={<Link to={`/${token.sequence.slug}`}>{token.sequence.source.name}</Link>}
        />
      </PageSection>
      <PageSection>{/* <TokenDetails token={token} /> */}</PageSection>
    </>
  );
};
