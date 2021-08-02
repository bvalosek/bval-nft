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
import { Address } from './Address';
import { getContracts } from '../contracts';
import { Divider } from './Divder';

interface Params {
  tokenId: string;
}

export const SQNCRDetail: FunctionComponent = () => {
  const [view, setView] = useState<SQNCRView | 'loading' | 'error'>('loading');
  const { tokenId } = useParams<Params>();

  const fetchSQNCR = async () => {
    setView('loading');
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
            <Button navTo="/sqncr/mint">🚀 MINT new SQNCR</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    );
  } else if (view === 'loading') {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING SQNCR</Title>
        </Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection></PageSection>
      <PageSection>
        <Content>
          <TwoPanel>
            <div>
              <img src={ipfsGatewayUrl(view.sqncr.metadata.image)} />
            </div>
            <div>
              <Content>
                <Title>SQNCR #{view.sqncr.tokenId}</Title>
                <p>
                  <strong>👤 owner</strong>: <Address address={view.sqncr.owner} />
                  <br />
                  <strong>🏗 created by</strong>: <Address address={view.sqncr.creator} />
                  <br />
                  <strong>🗂 variant</strong>: ???
                  <br />
                  <strong>🌈 shell</strong>: DEFAULT.EXE
                  <br />
                  <strong>📅 created</strong>: {view.sqncr.createdAt.toDateString()}
                  <br />
                </p>
                <ButtonGroup>
                  <Button externalNavTo={`https://opensea.io/assets/matic/${getContracts().sqncr}/${tokenId}`}>
                    ⛵️ VIEW on OpenSea
                  </Button>
                </ButtonGroup>
              </Content>
            </div>
          </TwoPanel>
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
