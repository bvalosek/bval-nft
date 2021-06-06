interface Contracts {
  lock: string;
  vibes: string;
  ssw: string;
  faucetV2: string;
}

export const getContracts = (): Contracts => {
  return {
    lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
    vibes: '0xF14874f2D27f4e11c73203767AB14D5088cD648E',
    ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
    faucetV2: '0x23B8cE2Da60Aab910739a377D977d10eE6864AC0',
  };
};
