interface Contracts {
  lock: string;
  vibes: string;
  ssw: string;
  faucetV2: string;
  quickswapVibesMatic: string;
  erc20BalanceStrategy: string;
  nftTokenFaucetStrategy: string;
  uniswapPoolStrategy: string;
  votePowerAdapter: string;
  votePowerTokenFacade: string;
  sqncr: string;
  defaultShell: string;
}

export const getContracts = (): Contracts => {
  return {
    lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
    vibes: '0xd269af9008c674b3814b4830771453d6a30616eb',
    ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
    faucetV2: '0x37bD35C6967B786306b6Fa201Ec5Cf5751675804',
    quickswapVibesMatic: '0x4F9e9C2EB7D90447FA190d4986b9E0A1562E2587',
    erc20BalanceStrategy: '0x473C14806Dd173201Aa650D6BAE2cb1635faE957',
    nftTokenFaucetStrategy: '0x2308BE9DFD702aeF9Ee42c28b54188A75f4313c9',
    uniswapPoolStrategy: '0xD35BA61d9Bd9AFe04347D88e59A4328a65dC9F4B',
    votePowerAdapter: '0xA2f67C69B1F5cFa725839a110901761C718eeB59',
    votePowerTokenFacade: '0xc6194299cdd7f0574ad8d63e23fd33c612efff98',
    defaultShell: '0x10cdca796801460eA73B316f3d293bef543AeA58',
    sqncr: '0x2e89A6C03Db862c817Cb70D0c16114391C89Dc4F',
  };
};
