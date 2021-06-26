import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { getTokenCount, getTokenInfoByIndex, TokenInfo } from '../lib/faucet';
import { getProvider } from '../lib/rpc';
import { currentTimestamp } from '../lib/web3';
import { getTokenMetadata, ScreensaverTokenMetadata } from '../lib/ssw';
import { useWallet } from './wallet';

const useTokensImplementation = () => {
  const provider = getProvider();
  const [tokens, setTokens] = useState<TokenInfo[] | undefined>();
  const [sampledAt, setSampledAt] = useState(currentTimestamp());
  const [tokenMetadata, setTokenMetadata] = useState<Record<string, ScreensaverTokenMetadata>>({});
  const { onTransactions } = useWallet();

  const fetch = async () => {
    const count = await getTokenCount(provider);
    const range = new Array(count).fill(null).map((x, index) => index);
    setSampledAt(currentTimestamp());

    const infos = await Promise.all(range.map((n) => getTokenInfoByIndex(provider, n)));
    setTokens(infos.sort((a, b) => Number(b.tokenId) - Number(a.tokenId)));

    await Promise.all(
      infos.map(async (i) => {
        if (i.isBurnt) {
          return;
        }
        const data = await getTokenMetadata(provider, i.tokenId);
        setTokenMetadata((m) => {
          return {
            ...m,
            [i.tokenId]: data,
          };
        });
      })
    );
  };

  useEffect(() => {
    // initial fetch
    fetch();

    return onTransactions(() => fetch());
  }, []);

  return { tokens, sampledAt, tokenMetadata, refreshTokenData: fetch };
};

type UseTokens = ReturnType<typeof useTokensImplementation>;

const TokensContext = createContext<UseTokens>(undefined);

export const TokensProvider: FunctionComponent = (props) => {
  const tokens = useTokensImplementation();
  if (tokens.tokens === undefined) {
    return null;
  }
  return (
    <TokensContext.Provider value={tokens}>{tokens.tokens !== undefined && props.children}</TokensContext.Provider>
  );
};

export const useTokens = (): UseTokens => {
  const tokens = useContext(TokensContext);
  return tokens;
};
