interface Contracts {
  lock: string;
  vibes: string;
  ssw: string;
  faucetV2: string;
}

export const getContracts = (): Contracts => {
  return {
    lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
    vibes: '0xd269af9008c674b3814b4830771453d6a30616eb',
    ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
    faucetV2: '0x37bD35C6967B786306b6Fa201Ec5Cf5751675804',
  };
};
