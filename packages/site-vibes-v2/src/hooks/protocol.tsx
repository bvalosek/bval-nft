import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { getProtocolView, ProtocolView } from '../web3/protocol';

/**
 * Global info about the protocol
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useProtocolImplementation = () => {
  const [protocolView, setProtocolView] = useState<ProtocolView | null>(null);

  const fetchProtocolInfo = async () => {
    setProtocolView(await getProtocolView());
  };

  useEffect(() => {
    fetchProtocolInfo();
    const h = setInterval(fetchProtocolInfo, 1000 * 30);
    return () => clearInterval(h);
  }, []);

  return {
    protocolView,
  };
};

type UseProtocol = ReturnType<typeof useProtocolImplementation>;

const ProtocolContext = createContext<UseProtocol>(undefined);

export const ProtocolProvider: FunctionComponent = (props) => {
  const info = useProtocolImplementation();
  return <ProtocolContext.Provider value={info}>{props.children}</ProtocolContext.Provider>;
};

export const useProtocol = (): UseProtocol => {
  const info = useContext(ProtocolContext);
  return info;
};
