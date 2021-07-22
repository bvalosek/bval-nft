import React, { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ContractTransaction } from 'ethers';
import { getContracts } from '../contracts';

const connector = new InjectedConnector({});

type WalletState = 'disconnected' | 'connected' | 'ready';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addToMetamask = async (provider: any) => {
  await provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: { address: getContracts().vibes, symbol: 'VIBES', decimals: 18 },
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const switchToPolygon = async (provider: any) => {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x89', // A 0x-prefixed hexadecimal chainId
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
    ],
  });
};

const walletPresent = (): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum !== undefined;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useWalletImplementation = () => {
  const { activate, active, error, chainId, account, library } = useWeb3React();
  const [transactions, setTransactions] = useState<ContractTransaction[]>([]);
  const callbacks = useRef<Array<() => unknown>>([]);

  const connect = async () => {
    await activate(connector);
  };

  const gotoPoly = async () => {
    const provider = await connector.getProvider();
    await switchToPolygon(provider);
  };

  const trackInMetamask = async () => {
    const provider = await connector.getProvider();
    await addToMetamask(provider);
  };

  const attemptReconnect = async () => {
    if (await connector.isAuthorized()) {
      await connect();
    }
  };

  const onTransactions = (callback: () => unknown) => {
    callbacks.current.push(callback);
    return () => {
      callbacks.current = callbacks.current.filter((cb) => cb !== callback);
    };
  };

  const registerTransactions = async (trx: ContractTransaction) => {
    setTransactions((trxs) => [...trxs, trx]);
    await trx.wait();
    setTransactions((trxs) => trxs.filter((t) => t !== trx));
    callbacks.current.forEach((cb) => cb());
    // TODO : refetch wallet
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
      // TODO : fetch account
    }
  }, [state, account]);

  return {
    state,
    library,
    account,
    error,
    connect,
    switchToPolygon: gotoPoly,
    trackInMetamask,
    registerTransactions,
    transactions,
    onTransactions,
    walletPresent,
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
