import React, { FunctionComponent } from 'react';
import { Divider } from './Divder';
import { Connect } from './Connect';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { SQNCRStats } from './SQNCRStats';
import { WalletStats } from './WalletStats';
import { Title } from './Title';

export const Wallet: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <WalletStats />
            <SQNCRStats />
            <div>
              <Title>Your VIBES NFTs</Title>
            </div>
            <Divider />
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
