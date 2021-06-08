import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { DecimalNumber } from './DecimalNumber';
import { Loading } from './Loading';
import { PageSection } from './PageSection';

interface Params {
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

export const TokenDetail: FunctionComponent = () => {
  const { tokenId } = useParams<Params>();
  const { tokens, tokenMetadata, sampledAt } = useTokens();
  const classes = useStyles();

  const token = tokens.find((t) => t.tokenId === tokenId);
  const metadata = tokenMetadata[tokenId];

  if (tokens.length === 0 || !metadata) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  return (
    <>
      <div className={classes.hero}>
        <div>
          <img src={metadata.image} />
        </div>
      </div>
      <PageSection maxWidth="1200px">
        <div>{metadata.name}</div>
        <div>{metadata.description}</div>
        <div>tags: {metadata.tags.join(', ')}</div>
        <div>
          intrinsic stake:{' '}
          <DecimalNumber number={token.claimable} interoplate={{ sampledAt: sampledAt, dailyRate: token.dailyRate }} />{' '}
          VIBES
        </div>
        <div>
          mining rate: <DecimalNumber number={token.dailyRate} /> VIBES/day
        </div>
        <div>
          mined to date: <DecimalNumber number={token.totalGenerated} /> VIBES/day
        </div>
        <div>
          claimed to date: <DecimalNumber number={token.totalClaimed} /> VIBES
        </div>
        <div>
          remaining lifetime value: <DecimalNumber number={token.balance} /> VIBES
        </div>
        <div>
          collector: <Address address={token.owner} />
        </div>
      </PageSection>
      ;
    </>
  );
};
