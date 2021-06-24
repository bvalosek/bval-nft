import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { claim } from '../lib/faucet';
import { vibesAmount } from '../lib/vibes';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Content } from './Content';
import { Loading } from './Loading';
import { New } from './Next';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { TokenCard } from './TokenCard';

interface Params {
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    claim: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(10),
      marginBottom: theme.spacing(10),
    },
  };
});

export const Claim: FunctionComponent = () => {
  const { tokenId } = useParams<Params>();
  const { tokens, tokenMetadata, sampledAt } = useTokens();
  const { account, library } = useWallet();
  const classes = useStyles();

  const onClaim = async () => {
    await claim(library.getSigner(), tokenId, vibesAmount(100));
  };

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
    <PageSection>
      <Title>
        😎 score some <Vibes /> 😎
      </Title>
      <Content>
        <p>Unstaking VIBES will be here SOOOOOOOOOOOOOON</p>
      </Content>
    </PageSection>
  );

  return (
    <>
      <PageSection>
        <Title>
          😎 score some <Vibes /> 😎
        </Title>
      </PageSection>
      {token.owner !== account && (
        <PageSection>
          <Content>
            <p>
              You are not the owner of <strong>{metadata.name}</strong>. Only the current owner of an NFT can claim the{' '}
              <Vibes /> staked inside it.
            </p>
            <p>
              <ButtonGroup>
                <Button navTo={`/tokens/${token.tokenId}`}>BACK</Button>
              </ButtonGroup>
            </p>
          </Content>
        </PageSection>
      )}
      {token.owner === account && (
        <PageSection>
          <div className={classes.claim}>
            <div>
              <TokenCard tokenId={token.tokenId} hideCollector hideTitle />
            </div>
            <div>claim</div>
          </div>
          <Content>
            <p>
              This will <New label="⚠️ permanently️ ⚠️" /> unstake <Vibes /> from <strong>{metadata.name}</strong> to
              your <Button navTo="/wallet">Wallet</Button>.
            </p>
            <p>Are you sure you want to continue?</p>
            <p>
              <ButtonGroup>
                <Button onClick={() => onClaim()}>
                  🤑 CLAIM <Vibes />
                </Button>
                <Button navTo={`/tokens/${token.tokenId}`}>🙅‍♀️ CANCEL</Button>
              </ButtonGroup>
            </p>
          </Content>
        </PageSection>
      )}
    </>
  );
};
