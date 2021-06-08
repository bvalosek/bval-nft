import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { DecimalNumber } from './DecimalNumber';
import { Loading } from './Loading';
import { ObjectLink } from './ObjectLink';
import { PageSection } from './PageSection';

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
      gap: theme.scaledSpacing(15),
    },
    info: {},
    token: {
      display: 'grid',
      gap: theme.scaledSpacing(1),
      fontSize: theme.scaledSpacing(4),
      '& video': {
        width: '100%',
        display: 'inline',
      },
    },
    top: {
      fontSize: theme.scaledSpacing(2.5),
      display: 'flex',
      '& div:first-child': {
        flex: 1,
        fontSize: theme.scaledSpacing(3),
      },
    },
    collector: {
      fontSize: theme.scaledSpacing(2.5),
      fontFamily: theme.impactFont,
      opacity: 0.5,
    },
  };
});

export const Tokens: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, tokenMetadata, sampledAt } = useTokens();

  if (tokens.length === 0) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  return (
    <PageSection maxWidth="1200px">
      <div className={classes.container}>
        {tokens.map((token) => {
          const metadata = tokenMetadata[token.tokenId];
          return (
            <div key={token.tokenId} className={classes.token}>
              <div>
                <Link to={`/tokens/${token.tokenId}`}>
                  {metadata?.image && <img src={metadata?.image} />}
                  {metadata?.animation_url && (
                    <video autoPlay muted loop controls={false}>
                      <source src={metadata.animation_url} />
                    </video>
                  )}
                </Link>
              </div>
              <div className={classes.info}>
                <div className={classes.top}>
                  <div className={classes.vibes}>
                    <DecimalNumber
                      number={token.claimable}
                      interoplate={{ sampledAt: sampledAt, dailyRate: token.dailyRate }}
                    />{' '}
                    VIBES
                  </div>
                  <div>
                    <ObjectLink tokenId={token.tokenId} />
                  </div>
                </div>
                <div className={classes.title}>{metadata?.name}</div>
                <div className={classes.collector}>
                  <Address address={token.owner} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
};
