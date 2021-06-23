import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { extractFlavorText, formatBytes } from '../lib/strings';
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
import { ButtonGroup } from './ButtonGroup';
import { addDaysFromNow } from '../lib/date';
import { useWallet } from '../hooks/wallet';

interface Params {
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    main: {
      fontSize: theme.spacing(3.5),
      '@media(min-width: 800px)': {
        fontSize: theme.spacing(4.5),
        display: 'grid',
        gridTemplateColumns: `auto ${theme.spacing(90)}`,
      },
    },
    title: {
      fontSize: theme.spacing(4.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5.5) },
      marginBottom: theme.spacing(2),
      fontWeight: 'bold',
      textDecoration: 'underline',
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
  const { account } = useWallet();
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
          <div>
            <div className={classes.title}>{metadata.name}</div>
            <Content>
              <p>{extractFlavorText(metadata.description)}</p>
              <p>
                🎨 <strong>artist</strong>:{' '}
                <Button onClick={() => window.open(`https://screensaver.world/created/${metadata.creator}`, '_blank')}>
                  <Address address={metadata.creator} />
                </Button>
                <br />
                🌈 <strong>collector</strong>:{' '}
                <Button onClick={() => window.open(`https://screensaver.world/owned/${token.owner}`, '_blank')}>
                  <Address address={token.owner} />
                </Button>
                <br />
                😎 <strong>stake</strong>
                : <DecimalNumber number={token.claimable} interoplate={interopolate} /> <Vibes />
                <br />
                💎 <strong>mining</strong>: <DecimalNumber number={token.dailyRate} decimals={0} /> <Vibes /> / day
                <br />
                🗓 <strong>minted</strong>: {new Date(metadata.creationDate).toDateString()}
                <br />
                🖼 <strong>media</strong>: {metadata.media.mimeType} {formatBytes(metadata.media.size)}
              </p>
            </Content>
          </div>
          <div>
            <Content>
              <Title>Actions</Title>
              <p style={{ textAlign: 'center' }}>
                <ButtonGroup>
                  <Button disabled={token.owner !== account} navTo={`/claim/${token.tokenId}`}>
                    😎 CLAIM <Vibes />
                  </Button>
                  <Button externalNavTo={`https://www.screensaver.world/object/${token.tokenId}`}>
                    🌌 VIEW on screensaver
                  </Button>
                  <Button
                    externalNavTo={`https://opensea.io/assets/matic/0x486ca491c9a0a9ace266aa100976bfefc57a0dd4/${token.tokenId}`}
                  >
                    ⛵️ VIEW on OpenSea
                  </Button>
                </ButtonGroup>
              </p>
            </Content>
          </div>
        </div>
      </PageSection>
      <PageSection>
        <Title>Details</Title>
        <Stats>
          <div>
            mined to date: <DecimalNumber number={token.totalGenerated} interoplate={interopolate} decimals={0} />{' '}
            <Vibes />
          </div>
          <div>
            claimed to date: <DecimalNumber number={token.totalClaimed} decimals={0} /> <Vibes />
          </div>
          <div>
            left to mine: <DecimalNumber number={token.balance.sub(token.claimable)} decimals={0} /> <Vibes />
          </div>
          <div>
            mining until:{' '}
            {addDaysFromNow(token.balance.sub(token.claimable).div(token.dailyRate).toNumber()).toDateString()}
          </div>
        </Stats>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
