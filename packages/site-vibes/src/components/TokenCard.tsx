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

interface Props {
  tokenId: string;
  hideCollector?: boolean;
  hideTitle?: bolean;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    token: {
      display: 'grid',
      gap: theme.spacing(2),
      fontSize: theme.spacing(4),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5) },
      '& video': {
        width: '100%',
        display: 'inline',
      },
    },
    media: {
      maxWidth: '50vh',
      '& img': {
        width: '100%',
      },
    },
    top: {
      '& a': {
        color: theme.palette.accent.secondary,
        '&:hover': {
          color: theme.palette.foreground.main,
          background: theme.palette.accent.main,
        },
      },
      display: 'flex',
      fontSize: theme.spacing(3.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(4.5) },
      '& div:first-child': {
        flex: 1,
      },
    },
    collector: {
      opacity: 0.5,
      fontSize: theme.spacing(3.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(4.5) },
    },
  };
});

export const TokenCard: FunctionComponent<Props> = ({ tokenId, hideCollector, hideTitle }) => {
  const classes = useStyles();
  const { tokens, tokenMetadata, sampledAt } = useTokens();

  if (tokens.length === 0) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  const token = tokens.find((t) => t.tokenId === tokenId);
  const metadata = tokenMetadata[token.tokenId];

  return (
    <div key={token.tokenId} className={classes.token}>
      <div>
        <div className={classes.media}>
          <Link to={`/tokens/${token.tokenId}`}>
            {metadata?.image && <img src={metadata?.image} />}
            {metadata?.animation_url && (
              <video autoPlay muted loop controls={false}>
                <source src={metadata.animation_url} />
              </video>
            )}
          </Link>
        </div>
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
        {!hideTitle && <div className={classes.title}>{metadata?.name}</div>}
        {!hideCollector && (
          <div className={classes.collector}>
            <Address address={token.owner} />
          </div>
        )}
      </div>
    </div>
  );
};
