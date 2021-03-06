import React, { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { addToMetamask, getTokenBalance } from '../lib/vibes';
import { switchToPolygon } from '../lib/web3';
import { getPooledVibes } from '../lib/quickswap';
import { getVotePower } from '../lib/gov';
import { ContractTransaction } from 'ethers';

const connector = new InjectedConnector({});

type WalletState = 'disconnected' | 'connected' | 'ready';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useWalletImplementation = () => {
  const { activate, active, error, chainId, account, library } = useWeb3React();
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const [votePower, setVotePower] = useState<BigNumber | null>(null);
  const [pooled, setPooled] = useState<BigNumber | null>(null);
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

  const fetchBalance = async () => {
    const provider = library.getSigner();
    const balance = await getTokenBalance(provider, account);
    setBalance(balance);
    const pooled = await getPooledVibes(provider, account);
    setPooled(pooled);
    const power = await getVotePower(provider, account);
    setVotePower(power);
  };

  const registerTransactions = async (trx: ContractTransaction) => {
    setTransactions((trxs) => [...trxs, trx]);
    await trx.wait();
    setTransactions((trxs) => trxs.filter((t) => t !== trx));
    callbacks.current.forEach((cb) => cb());
    await fetchBalance();
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
    switchToPolygon: gotoPoly,
    trackInMetamask,
    registerTransactions,
    transactions,
    onTransactions,
    pooled,
    votePower,
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
