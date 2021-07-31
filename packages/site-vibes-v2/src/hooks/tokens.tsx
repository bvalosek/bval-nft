import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Metadata, resolveMetadata } from '../lib/nft';
import { getRecentTokens, NFTView, nftViewId } from '../web3/wellspringv2';

/**
 * Global info about the protocol
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTokensImplementation = () => {
  const [tokens, setTokens] = useState<NFTView[] | null>(null);
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});

  const fetchTokens = async () => {
    const tokens = await getRecentTokens({ limit: 100 });
    setTokens(tokens);
  };

  useEffect(() => {
    fetchTokens();
    const h = setInterval(fetchTokens, 1000 * 60);
    return () => clearInterval(h);
  }, []);

  const fetchMetadata = async (token: NFTView) => {
    const resolved = await resolveMetadata(token);
    setMetadata((prev) => {
      const key = nftViewId(token);
      if (prev[key]) return prev; // optimization -- dont set state if we've already got metadata
      return {
        ...prev,
        [key]: resolved,
      };
    });
  };

  const getMetadata = (token: NFTView): Metadata | undefined => {
    const data = metadata[nftViewId(token)];
    if (data === undefined) fetchMetadata(token);
    return data;
  };

  return {
    tokens,
    getMetadata,
  };
};

type UseTokens = ReturnType<typeof useTokensImplementation>;

const TokensContext = createContext<UseTokens>(undefined);

export const TokensProvider: FunctionComponent = (props) => {
  const info = useTokensImplementation();
  return <TokensContext.Provider value={info}>{props.children}</TokensContext.Provider>;
};

export const useTokens = (): UseTokens => {
  const info = useContext(TokensContext);
  return info;
};
