import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '../lib/contracts';
import { Button } from './Button';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { deployDefaultShell, deploySQNCR, setDefaultShell, setVIPs } from '../lib/sqncr';

export const Deploy: FunctionComponent = () => {
  const { library } = useWallet();
  const contracts = getContracts();

  return (
    <>
      <PageSection>
        <Title>Deployment</Title>
      </PageSection>
      <PageSection>
        <Content>
          <p>vibes: {contracts.vibes === '0x0' ? <Button>DEPLOY</Button> : <code>{contracts.vibes}</code>}</p>
          <p>
            defaultShell:{' '}
            {contracts.defaultShell === '0x0' ? (
              <Button onClick={() => deployDefaultShell(library.getSigner())}>DEPLOY</Button>
            ) : (
              <code>{contracts.defaultShell}</code>
            )}
            <br />
            sqncr:{' '}
            {contracts.sqncr === '0x0' ? (
              <Button onClick={() => deploySQNCR(library.getSigner())}>DEPLOY</Button>
            ) : (
              <>
                <code>{contracts.sqncr}</code> <Button onClick={() => setVIPs(library.getSigner())}>SET VIPs</Button>{' '}
                <Button onClick={() => setDefaultShell(library.getSigner())}>SET DEFAULT SHELL</Button>
              </>
            )}
            <br />
          </p>
        </Content>
      </PageSection>
    </>
  );
};
