import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { getTokenBalance } from '../lib/vibes';

export const POLYGON_MAINNET_PARAMS = {
  chainId: '0x89', // A 0x-prefixed hexadecimal chainId
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mainnet.matic.network'],
  blockExplorerUrls: ['https://explorer.matic.network/'],
};

const connector = new InjectedConnector({});

type WalletState = 'disconnected' | 'connected' | 'ready';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useWalletImplementation = () => {
  const { activate, active, error, chainId, account, library } = useWeb3React();
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const connect = async () => {
    await activate(connector);
  };

  const switchToPolygon = async () => {
    const provider = await connector.getProvider();
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [POLYGON_MAINNET_PARAMS],
    });
  };

  const attemptReconnect = async () => {
    if (await connector.isAuthorized()) {
      await connect();
    }
  };

  const fetchBalance = async () => {
    const balance = await getTokenBalance(library.getSigner(), account);
    setBalance(balance);
  };

  useEffect(() => {
    attemptReconnect();
  }, []);

  let state: WalletState = 'disconnected';
  if (active && chainId === 137) {
    state = 'ready';
  } else if (active) {
    state = 'connected';
  }

  useEffect(() => {
    if (state === 'ready' && library) {
      fetchBalance();
    }
  }, [state, account]);

  return {
    balance,
    state,
    library,
    account,
    error,
    connect,
    switchToPolygon,
  };
};

type UseWallet = ReturnType<typeof useWalletImplementation>;

const WalletContext = createContext<UseWallet>(undefined);

export const WalletProvider: FunctionComponent = (props) => {
  const tokens = useWalletImplementation();
  return <WalletContext.Provider value={tokens}>{props.children}</WalletContext.Provider>;
};

export const useWallet = (): UseWallet => {
  const tokens = useContext(WalletContext);
  return tokens;
};
