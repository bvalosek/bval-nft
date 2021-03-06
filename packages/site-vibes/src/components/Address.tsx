import React, { FunctionComponent, useEffect, useState } from 'react';
import { resolveTwitterId } from '../lib/proof-of-twitter';
import { truncateHex } from '../lib/strings';

interface Props {
  address: string;
}

export const Address: FunctionComponent<Props> = ({ address }) => {
  const [resolved, setResolved] = useState<string | undefined>();

  const fetch = async () => {
    const id = await resolveTwitterId(address);
    if (id === undefined) {
      return;
    }
    setResolved(id);
  };

  useEffect(() => {
    setResolved(undefined);
    fetch();
  }, [address]);

  if (resolved !== undefined) {
    return <span>@{resolved}</span>;
  }

  return <span>{truncateHex(address)}</span>;
};
