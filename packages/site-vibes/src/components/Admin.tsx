import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { cleanupToken } from '../lib/faucet';
import { Button } from './Button';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Seed } from './Seed';

export const Admin: FunctionComponent = () => {
  const { tokens } = useTokens();
  const { library } = useWallet();

  const doCleanup = async (tokenId: string) => {
    await cleanupToken(library.getSigner(), tokenId);
  };

  return (
    <PageSection>
      <Content>
        <h1>Admin</h1>
        <Connect>
          <h2>Cleanup Tokens</h2>
          {tokens
            .filter((t) => t.isBurnt)
            .map((token) => (
              <div key={token.tokenId}>
                object#{token.tokenId} - <DecimalNumber number={token.balance} /> balance -{' '}
                <Button onClick={() => doCleanup(token.tokenId)}>cleanup</Button>
              </div>
            ))}
          <h2>Seed Tokens</h2>
          <Seed />
        </Connect>
      </Content>
    </PageSection>
  );
};
