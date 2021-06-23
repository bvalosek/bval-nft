interface Contracts {
  lock: string;
  vibes: string;
  ssw: string;
  faucetV2: string;
}

export const getContracts = (): Contracts => {
  return {
    lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
    vibes: '0xCb437B5BC51734e1065C7Eeb18C48aFe8F4555e5',
    ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
    faucetV2: '0x88cf52a742ba72Cb4B6662e5b1B14c54F9853CC7',
  };
};
