import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { Container } from './Container';
import { getManagedTokenInfo, getSeeders, seedFaucetToken, useContracts } from '../util/contract';
import { useWeb3Strict } from '../util/web3';

export const ManageFaucet: FunctionComponent = () => {
  const { library } = useWeb3Strict();
  const contracts = useContracts();
  const [seeders, setSeeders] = useState<string[]>([]);

  const fetch = async () => {
    setSeeders(await getSeeders(contracts.faucetV2, library.getSigner()));
    await getManagedTokenInfo(contracts.faucetV2, library.getSigner());
  };

  const seed = async () => {
    await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
      tokenId: '373',
      totalDays: 365 * 3,
      dailyRateInWholeVibes: 1000,
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container>
      <Text h2>Seeders</Text>
      <ul>
        {seeders.map((seeder) => (
          <li key={seeder}>
            <code>{seeder}</code>
          </li>
        ))}
      </ul>
      <Text h2>Managed Tokens</Text>
      <p>hey</p>
      <Text h2>Seed Tokens</Text>
      <Button
        onClick={async () => {
          seed();
        }}
      ></Button>
    </Container>
  );
};
