import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { DecimalNumber } from './DecimalNumber';
import { Loading } from './Loading';
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
    token: {
      display: 'grid',
      gap: theme.scaledSpacing(3),
      fontSize: theme.scaledSpacing(4),
    },
    top: {
      display: 'flex',
      '& div:first-child': {
        flex: 1,
      },
    },
    vibes: {
      fontSize: theme.scaledSpacing(3),
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
                <img src={metadata?.image} />
              </div>
              <div className={classes.info}>
                <div className={classes.vibes}>
                  <DecimalNumber
                    number={token.claimable}
                    interoplate={{ sampledAt: sampledAt, dailyRate: token.dailyRate }}
                  />{' '}
                  $VIBES
                </div>
                <div className={classes.title}>{metadata?.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
};
