import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { Button } from './Button';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { Divider } from './Divder';
import { Loading } from './Loading';
import { PageSection } from './PageSection';
import { Stats } from './Stats';
import { Title } from './Title';
import { TokenCard } from './TokenCard';
import { Vibes } from './Vibes';

interface Params {
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    main: {
      fontSize: theme.spacing(3.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(4.5) },
    },
    title: {
      fontSize: theme.spacing(4.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5.5) },
      marginBottom: theme.spacing(2),
      fontWeight: 'bold',
      color: theme.palette.accent.secondary,
    },
    hero: {
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        padding: theme.spacing(4),
        marginTop: theme.spacing(6),
        maxHeight: '60vh',
      },
    },
  };
});

export const TokenDetail: FunctionComponent = () => {
  const { tokenId } = useParams<Params>();
  const { tokens, tokenMetadata, sampledAt } = useTokens();
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const token = tokens.find((t) => t.tokenId === tokenId);
  const metadata = tokenMetadata[tokenId];

  if (tokens.length === 0 || !metadata) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  const interopolate = { sampledAt, dailyRate: token.dailyRate };

  return (
    <>
      <div className={classes.hero}>
        <div>
          <TokenCard hideCollector hideTitle tokenId={token.tokenId} />
        </div>
      </div>
      <PageSection>
        <div className={classes.main}>
          <div className={classes.title}>{metadata.name}</div>
          <Content>
            <p>
              {metadata.description}
              <br />
              tags: {metadata.tags.map((t) => `#${t}`).join(', ')}
            </p>
            <p>
              🌈 collector:{' '}
              <Button onClick={() => window.open(`https://screensaver.world/owned/${token.owner}`, '_blank')}>
                <Address address={token.owner} />
              </Button>
            </p>
          </Content>
          {/* <div>{metadata.description}</div>
          <div>tags: {metadata.tags.map((t) => `#${t}`).join(', ')}</div>
          <div>
            🌈 collector:{' '}
            <Button onClick={() => (`https://screensaver.world/ownwindow.opened/${token.owner}`, '_blank')}>
              <Address address={token.owner} />
            </Button>
          </div> */}
        </div>
      </PageSection>
      <PageSection>
        <Title>Details</Title>
        <Stats>
          <div>
            intrinsic stake: <DecimalNumber number={token.claimable} interoplate={interopolate} /> <Vibes />
          </div>
          <div>
            mining rate: <DecimalNumber number={token.dailyRate} decimals={0} /> <Vibes /> / day
          </div>
          <div>
            mined to date: <DecimalNumber number={token.totalGenerated} interoplate={interopolate} decimals={0} />{' '}
            <Vibes />
          </div>
          <div>
            claimed to date: <DecimalNumber number={token.totalClaimed} decimals={0} /> <Vibes />
          </div>
          <div>
            current value: <DecimalNumber number={token.balance} decimals={0} /> <Vibes />
          </div>
        </Stats>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
