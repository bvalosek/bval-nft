import { useCallback } from 'react';
import { storageGet, storageSet } from '../lib/local-storage';
import { useTokens } from './tokens';

const skey = 'nextPrimaryPage state';

export const featuredTokenId = '1239';

interface PrimaryPageState {
  lastSeenFeaturedToken?: {
    tokenId: string;
    owner: string;
  };
  seenInfo?: boolean;
}

/** determine what to show we we land on the root page of the site */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useNextPrimaryPage = () => {
  const { tokens } = useTokens();

  const token = tokens.find((t) => t.tokenId === featuredTokenId);

  const next = useCallback(() => {
    const current = storageGet<PrimaryPageState>(skey) ?? {};
    const lastToken = current.lastSeenFeaturedToken;
    const isNewCollector = lastToken?.owner !== token.owner;

    // if new featured token or new collector
    if (lastToken?.tokenId !== featuredTokenId || isNewCollector) {
      storageSet<PrimaryPageState>(skey, {
        ...current,
        lastSeenFeaturedToken: {
          tokenId: token.tokenId,
          owner: token.owner,
        },
      });
      return '/featured';
    }

    // if never seen info page
    if (!current.seenInfo) {
      storageSet<PrimaryPageState>(skey, { ...current, seenInfo: true });
      return '/info';
    }

    // else tokens
    return '/tokens';
  }, []);

  return { next };
};
