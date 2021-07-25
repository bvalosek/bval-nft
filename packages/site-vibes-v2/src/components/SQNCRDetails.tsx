import React, { FunctionComponent, useEffect, useState } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { getSQNCRView, SQNCRView } from '../web3/sqncr';
import { ipfsGatewayUrl } from '../lib/ipfs';
import { useParams } from 'react-router-dom';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { TwoPanel } from './TwoPanel';

interface Params {
  tokenId: string;
}

export const SQNCRDetail: FunctionComponent = () => {
  const [view, setView] = useState<SQNCRView | null | 'error'>(null);
  const { tokenId } = useParams<Params>();

  const fetchSQNCR = async () => {
    try {
      const [sqncr] = await getSQNCRView([tokenId]);
      setView(sqncr);
    } catch (err) {
      setView('error');
    }
  };

  useEffect(() => {
    fetchSQNCR();
  }, [tokenId]);

  if (view === 'error') {
    return (
      <PageSection>
        <Content>
          <Title>⚠️ SQNCR Not Found</Title>
          <ButtonGroup>
            <Button navTo="/sqncr">🎛 VIEW my SQNCRs</Button>
            <Button navTo="/mint-sqncr">🚀 MINT new SQNCR</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    );
  } else if (view === null) {
    return (
      <PageSection>
        <Content>
          <title>⌛️ Loading, Please Wait</title>
        </Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <Content>
          <TwoPanel>
            <div>
              <img src={ipfsGatewayUrl(view.sqncr.metadata.image)} />
            </div>
            <div>
              <Title>SQNCR #{view.sqncr.tokenId}</Title>
            </div>
          </TwoPanel>
        </Content>
      </PageSection>
    </>
  );
};
