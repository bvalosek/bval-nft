import { useEffect, useState } from 'react';
import { getTokenCount, getTokenInfoByIndex, TokenInfo } from '../lib/faucet';
import { getProvider } from '../lib/rpc';
import { currentTimestamp } from '../lib/web3';

interface UseTokens {
  tokens: TokenInfo[];
  sampledAt: number;
}

export const useTokens = (): UseTokens => {
  const provider = getProvider();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [sampledAt, setSampledAt] = useState(currentTimestamp());

  const fetch = async () => {
    const count = await getTokenCount(provider);
    const range = new Array(count).fill(null).map((x, index) => index);
    setSampledAt(currentTimestamp());
    const infos = await Promise.all(range.map((n) => getTokenInfoByIndex(provider, n)));
    setTokens(infos);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { tokens, sampledAt };
};
