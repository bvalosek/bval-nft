import { ContractTransaction } from 'ethers';
import React, { FunctionComponent, useState } from 'react';
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
  const [mintTrx, setMintTrx] = useState<ContractTransaction | null>(null);

  const mint = async () => {
    const trx = await mintSQNCR(library.getSigner());
    registerTransactions(trx);
    setMintTrx(trx);
    await trx.wait();
    setMintTrx(null);
  };

  if (mintTrx !== null) {
    return (
      <>
        <PageSection>
          <Content>
            <Title>Transaction Submitted</Title>
            <p>Your SQNCR is being minted.</p>
            <p>😎 Nice work.</p>
            <ButtonGroup>
              <Button externalNavTo={`https://polygonscan.com/tx/${mintTrx.hash}`}>🔎 VIEW transaction</Button>
              <Button navTo="/sqncr">🎛 MANAGE your SQNCRs</Button>
            </ButtonGroup>
          </Content>
        </PageSection>
      </>
    );
  }

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
              You have already minted{' '}
              <Button navTo="/sqncr">
                <strong>{accountView?.mintedSQNCRs} SQNCR(s)</strong>
              </Button>{' '}
              out of the <strong>{accountView?.maxMints} allowed</strong> per address.
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
