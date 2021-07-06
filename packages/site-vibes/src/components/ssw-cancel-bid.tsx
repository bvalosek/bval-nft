import React, { FunctionComponent, useState } from 'react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { Input } from './Input';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { useWallet } from '../hooks/wallet';
import { burnToken, cancelBid, unlistObject } from '../lib/ssw';

export const SSWCancelBid: FunctionComponent = () => {
  const { library, registerTransactions } = useWallet();
  const [tokenId, setTokenId] = useState('');

  const input = (s: string) => {
    if (s.match(/^[1-9]*$/)) {
      setTokenId(s);
    }
  };

  const cancel = async () => {
    const trx = await cancelBid(library.getSigner(), tokenId);
    registerTransactions(trx);
  };

  const unlist = async () => {
    const trx = await unlistObject(library.getSigner(), tokenId);
    registerTransactions(trx);
  };

  const burn = async () => {
    const trx = await burnToken(library.getSigner(), tokenId);
    registerTransactions(trx);
  };

  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <Title>SSW Debug Action</Title>
            <div>
              <Input placeholder="input object #" onTextChange={input} value={tokenId} />{' '}
            </div>
            <ButtonGroup>
              <Button onClick={() => cancel()} disabled={tokenId === ''}>
                CANCEL BID
              </Button>
              <Button onClick={() => unlist()} disabled={tokenId === ''}>
                UNLIST OBJECT
              </Button>
              <Button onClick={() => burn()} disabled={tokenId === ''}>
                BURN
              </Button>
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
