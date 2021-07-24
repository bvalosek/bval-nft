import React, { FunctionComponent } from 'react';
import { Connect } from './Connect';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { WalletStats } from './WalletStats';

export const Wallet: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <WalletStats />
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
