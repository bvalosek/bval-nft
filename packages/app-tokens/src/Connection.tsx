import React, { FunctionComponent, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

/**
 * Load child components once injected web3 wallet connection is established
 */
export const Connection: FunctionComponent = (props) => {
  const { activate, active, error } = useWeb3React();

  // blind attempt injected connector on boot
  useEffect(() => {
    const connector = new InjectedConnector({ supportedChainIds: [1, 4] });
    activate(connector);
  }, []);

  if (error) {
    return <p>unable to connect to wallet: {error}</p>;
  }

  if (!active) {
    return <p>connecting to injected web3 context...</p>;
  }

  return <>{props.children} </>;
};
