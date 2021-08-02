import React, { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ContractTransaction } from 'ethers';

import { getContracts } from '../contracts';
import { AccountView, getAccountView } from '../web3/account';

const connector = new InjectedConnector({});

type WalletState = 'init' | 'disconnected' | 'connected' | 'ready';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addToMetamask = async (provider: any) => {
  await provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: getContracts().vibes,
        symbol: 'VIBES',
        decimals: 18,
        image: 'https://gateway.pinata.cloud/ipfs/Qmdy4Tv8XZEGS2BAcs99CkmoBw6NwBtJ7K38yJ8x5p4cYY',
      },
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
        rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [transactions, setTransactions] = useState<ContractTransaction[]>([]);
  const [accountView, setAccountView] = useState<AccountView | null>(null);
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
    setIsLoaded(true);
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
    await Promise.all([fetchAccount()]);
  };

  const fetchAccount = async () => {
    setAccountView(await getAccountView(account));
  };

  useEffect(() => {
    attemptReconnect();
  }, []);

  let state: WalletState = 'init';
  if (active && chainId === 137) {
    state = 'ready';
  } else if (active) {
    state = 'connected';
  } else if (isLoaded) {
    state = 'disconnected';
  }

  useEffect(() => {
    if (state !== 'ready') {
      setAccountView(null);
    } else if (state === 'ready' && library) {
      setAccountView(null);
      fetchAccount();
    }
  }, [account, state]);

  const activeSQNCR = accountView && accountView.sqncrs.length > 0 ? accountView.sqncrs[0] : null;

  return {
    state,
    library,
    account,
    error,
    connect,
    accountView,
    switchToPolygon: gotoPoly,
    trackInMetamask,
    registerTransactions,
    transactions,
    onTransactions,
    walletPresent,
    activeSQNCR,
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
