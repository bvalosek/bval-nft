import React, { FunctionComponent } from 'react';
import { Divider } from './Divder';
import { Connect } from './Connect';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { SQNCRStats } from './SQNCRStats';
import { WalletStats } from './WalletStats';

export const Wallet: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <WalletStats />
            <SQNCRStats />
            <Divider />
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
