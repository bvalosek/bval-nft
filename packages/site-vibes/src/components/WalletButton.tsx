import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { Address } from './Address';
import { DecimalNumber } from './DecimalNumber';

export const WalletButton: FunctionComponent = () => {
  const { state, connect, switchToPolygon, account, balance } = useWallet();
  if (state === 'disconnected') {
    return <span onClick={() => connect()}>connect</span>;
  }

  if (state === 'connected') {
    return <span onClick={() => switchToPolygon()}>switch to polygon</span>;
  }

  return (
    <>
      <Address address={account} /> | <DecimalNumber number={balance} decimals={0} /> VIBES
    </>
  );
};
