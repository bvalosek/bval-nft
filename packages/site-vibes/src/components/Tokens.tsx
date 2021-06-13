import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { DecimalNumber } from './DecimalNumber';
import { Divider } from './Divder';
import { Loading } from './Loading';
import { ObjectLink } from './ObjectLink';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { TokenCard } from './TokenCard';

interface Props {
  owner?: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'grid',
      '@media(min-width: 800px)': {
        gridTemplateColumns: '1fr 1fr',
      },
      '@media(min-width: 1000px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
      },
      gap: theme.scaledSpacing(10),
    },
    info: {},
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

export const Tokens: FunctionComponent<Props> = ({ owner }) => {
  const classes = useStyles();
  const { tokens, tokenMetadata, sampledAt } = useTokens();

  if (tokens.length === 0) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  let filtered = tokens.filter((t) => !t.isBurnt);
  if (owner) {
    filtered = filtered.filter((t) => t.owner === owner);
  }

  return (
    <>
      <PageSection>
        <Title>@bvalosek's Screensaver.World NFTs</Title>
        <div className={classes.container}>
          {filtered.map((token) => (
            <TokenCard hideCollector tokenId={token.tokenId} />
          ))}
        </div>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
