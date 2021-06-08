import { BigNumber } from '@ethersproject/bignumber';
import React, { FunctionComponent, useState } from 'react';
import { useWallet } from '../hooks/wallet';
import { seedToken } from '../lib/faucet';
import { getProvider } from '../lib/rpc';
import { getTokenMetadata, ScreensaverTokenMetadata } from '../lib/ssw';
import { Address } from './Address';
import { Button } from './Button';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { Input } from './Input';

export const Seed: FunctionComponent = () => {
  const [tokenId, setTokenId] = useState('');
  const [dailyRate, setDailyRate] = useState(1000);
  const [totalDays, setTotalDays] = useState(1095);
  const [backdateDays, setBackdateDays] = useState(0);
  const [metadata, setMetadata] = useState<ScreensaverTokenMetadata | undefined>();
  const { library } = useWallet();

  const fetchMetadata = async () => {
    const resp = await getTokenMetadata(library.getSigner(), tokenId);
    setMetadata(resp);
  };

  const seed = async () => {
    await seedToken(library.getSigner(), { tokenId, dailyRateInWholeVibes: dailyRate, totalDays, backdateDays });
  };

  const total = BigNumber.from('1000000000000000000').mul(dailyRate).mul(totalDays);

  return (
    <div>
      <Content>
        Token to seed: {tokenId}
        {metadata == undefined ? (
          <>
            <Input placeholder="token id" onTextChange={(val) => setTokenId(val)} />
            <Button onClick={() => fetchMetadata()}>check token</Button>
          </>
        ) : (
          <>
            <p>
              <div>name: {metadata.name}</div>
              <div>description: {metadata.description}</div>
              <div>
                creator: <Address address={metadata.creator} />
              </div>
              <div>
                <Input placeholder="daily rate" onTextChange={(val) => setDailyRate(Number(val))} value={dailyRate} />
                <Input placeholder="total days" onTextChange={(val) => setTotalDays(Number(val))} value={totalDays} />
                <Input
                  placeholder="backdate days"
                  onTextChange={(val) => setBackdateDays(Number(val))}
                  value={backdateDays}
                />
              </div>
              <div>
                daily rate: {dailyRate}
                <br />
                total days: {totalDays}
                <br />
                total weeks: {totalDays / 7}
                <br />
                total years: {totalDays / 365}
                <br />
                backdate days: {backdateDays}
                <br />
                total VIBES: <DecimalNumber number={total} />
              </div>
              <div>
                <Button onClick={() => seed()}>SEED!!</Button>
              </div>
            </p>
          </>
        )}
      </Content>
    </div>
  );
};
