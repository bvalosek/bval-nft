import React, { FunctionComponent, useState } from 'react';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Connect } from '../components/Connect';
import { Content } from '../components/Content';
import { Input } from '../components/Input';
import { PageSection } from '../components/PageSection';
import { Title } from '../components/Title';
import { useWallet } from '../hooks/wallet';
import { cancelBid, unlistObject } from './ssw';

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
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
