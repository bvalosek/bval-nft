import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { claim } from '../lib/faucet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Content } from './Content';
import { Loading } from './Loading';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { Claimer } from './Claimer';
import { BigNumber, ContractTransaction } from 'ethers';

interface Params {
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    claim: {
      '@media(min-width: 800px)': {
        display: 'grid',
        gridTemplateColumns: `${theme.spacing(80)} auto`,
        gap: theme.spacing(10),
        marginBottom: theme.spacing(10),
      },
    },
  };
});

export const Claim: FunctionComponent = () => {
  const { tokenId } = useParams<Params>();
  const [trx, setTrx] = useState<null | ContractTransaction>(null);
  const { tokens, tokenMetadata, sampledAt } = useTokens();
  const { account, library, registerTransactions } = useWallet();
  const classes = useStyles();

  const onClaim = async (amount: BigNumber) => {
    const resp = await claim(library.getSigner(), tokenId, amount);
    setTrx(resp);
    registerTransactions(resp);
    return resp;
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

  if (trx) {
    return (
      <>
        <PageSection>
          <Title>
            😎 score some <Vibes /> 😎
          </Title>
        </PageSection>
        <PageSection>
          <Content>
            <p>
              Claim transaction submitted! Your <Vibes /> are on the way.
            </p>
            <ButtonGroup>
              <Button navTo={`/tokens/${token.tokenId}`}>🖼 BACK to NFT</Button>
              <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>🔎 VIEW on Polygonscan</Button>
            </ButtonGroup>
          </Content>
        </PageSection>
      </>
    );
  }

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
        <>
          <PageSection>
            <Claimer tokenId={token.tokenId} onClaim={onClaim} />
          </PageSection>
          <PageSection>
            <Content>
              <p style={{ textAlign: 'center' }}>
                This will <strong>PERMANENTLY</strong> unstake the <Vibes /> inside of your NFT! More <Vibes /> will
                continue to be mined after unstaking.
              </p>
              <p>
                <ButtonGroup>
                  <Button navTo={`/tokens/${token.tokenId}`}>🙅 CANCEL</Button>
                </ButtonGroup>
              </p>
            </Content>
          </PageSection>
        </>
      )}
    </>
  );
};
