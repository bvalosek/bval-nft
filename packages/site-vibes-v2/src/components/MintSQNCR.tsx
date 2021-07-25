import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { mintSQNCR } from '../web3/sqncr';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';

export const MintSQNCR: FunctionComponent = () => {
  const { accountView, library, registerTransactions } = useWallet();

  const mint = async () => {
    const trx = await mintSQNCR(library.getSigner());
    registerTransactions(trx);
  };

  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <Title>Mint SQNCR</Title>
            <p>
              🎛 A <Button navTo={'/sqncr'}>SQNCR</Button> is an <strong>NFT-based digital product</strong> and a
              self-soverign modular application platform.
            </p>
            <p>
              🏄‍♀️ It's a personal, tokenized carrier wave for the <Vibes /> <Button navTo="/protocol">protocol</Button>.
            </p>
            <p>
              You have already minted <strong>{accountView?.mintedSQNCRs} SQNCR(s)</strong> out of the{' '}
              <strong>{accountView?.maxMints} allowed</strong> per address.
            </p>
            <ButtonGroup>
              {accountView?.maxMints > accountView?.mintedSQNCRs ? (
                <Button onClick={() => mint()}>🚀 MINT your SQNCR</Button>
              ) : (
                <Button disabled>max SQNCRs minted</Button>
              )}
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
