import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { GatsbyTokenData } from '../hooks/tokens';
import Img from 'gatsby-image';
import { makeStyles } from '@material-ui/styles';

import { ThemeConfig } from '../Theme';

interface Props {
  tokens: GatsbyTokenData[];
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'grid',
      '@media(min-width: 800px)': {
        gridTemplateColumns: '1fr 1fr',
      },
      '@media(min-width: 1100px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
      },
      // gap: `calc(${theme.spacing(5)} + 3vw)`,
      gap: theme.scaledSpacing(15),
    },
    token: {
      display: 'grid',
      gap: theme.scaledSpacing(2.5),
      lineHeight: 1.2,
      fontSize: theme.scaledSpacing(4),
    },
    top: {
      display: 'flex',
      '& div:first-child': {
        flex: 1,
      },
      color: theme.palette.foreground.secondary,
      fontSize: theme.scaledSpacing(3.5),
    },
    title: {
      fontSize: theme.scaledSpacing(5.5),
      fontWeight: 'bold',
    },
    description: {
      fontStyle: 'italic',
      color: theme.palette.foreground.light,
    },
  };
});

export const TokenGrid: FunctionComponent<Props> = (props) => {
  const { tokens } = props;

  const classes = useStyles();

  const to = (token: GatsbyTokenData): string => `/tokens/${token.slug}`;

  return (
    <div className={classes.container}>
      {tokens.map((token) => (
        <div key={token.tokenId} className={classes.token}>
          <div>
            <Link to={to(token)}>
              <Img fluid={token.metadata[0].remoteImage.childImageSharp.fluid} />
            </Link>
          </div>

          <div>
            <div className={classes.top}>
              <div>{token.sequence.source.name}</div>
              <div>#{token.source.token.tokenNumber}</div>
            </div>

            <div className={classes.title}>
              <Link className={classes.name} to={to(token)}>
                {token.source.name}
              </Link>
            </div>

            <div className={classes.description}>{token.source.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
