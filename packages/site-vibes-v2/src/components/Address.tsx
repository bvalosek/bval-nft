import React, { FunctionComponent, useEffect, useState } from 'react';
import { resolveTwitterId } from '../lib/proof-of-twitter';
import { truncateHex } from '../lib/strings';
import { lookupEnsName } from '../lib/ens';

interface Props {
  address: string;
}

const _cache = new Map<string, string>();

export const Address: FunctionComponent<Props> = ({ address }) => {
  const [resolved, setResolved] = useState<string | undefined>(_cache.get(address));

  const fetch = async () => {
    if (_cache.has(address)) {
      return;
    }
    const id = await resolveTwitterId(address);
    if (id === undefined) {
      const name = await lookupEnsName(address);
      if (name) {
        setResolved(name);
        _cache.set(address, name);
      }
      return;
    }
    const name = `@${id}`;
    setResolved(name);
    _cache.set(address, name);
  };

  useEffect(() => {
    setResolved(_cache.get(address));
    fetch();
  }, [address]);

  if (resolved !== undefined) {
    return <span>{resolved}</span>;
  }

  return <span>{truncateHex(address)}</span>;
};
