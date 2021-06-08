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

  // TODO: something better lol
  const seed = async () => {
    // https://www.screensaver.world/object/373
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '373',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 1000,
    // });
    // https://www.screensaver.world/object/180
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '180',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 1000,
    //   backdateDays: 2,
    // });
    // https://www.screensaver.world/object/168
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '168',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 1000,
    //   backdateDays: 2,
    // });
    // https://www.screensaver.world/object/156
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '156',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 1000,
    //   backdateDays: 2,
    // });
    // https://www.screensaver.world/object/127
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '127',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 1000,
    //   backdateDays: 2,
    // });
    // https://www.screensaver.world/object/741
    // await seedFaucetToken(contracts.faucetV2, contracts.vibes, library.getSigner(), {
    //   tokenId: '741',
    //   totalDays: 365 * 3,
    //   dailyRateInWholeVibes: 3000,
    //   backdateDays: 0,
    // });
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
