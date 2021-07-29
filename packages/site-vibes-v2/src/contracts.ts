// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getContracts = () => {
  return {
    // core
    vibes: '0xd269af9008c674b3814b4830771453d6a30616eb',
    lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
    wellspring: '0x37bD35C6967B786306b6Fa201Ec5Cf5751675804',
    lockV2: '0x222DA9397FCfcea9DB8e3423cd0d3b64bd16ac33',
    wellspringV2: '0x0',

    // gov
    votePowerAdapter: '0xA2f67C69B1F5cFa725839a110901761C718eeB59',
    erc20BalanceStrategy: '0x473C14806Dd173201Aa650D6BAE2cb1635faE957',
    nftTokenFaucetStrategy: '0x2308BE9DFD702aeF9Ee42c28b54188A75f4313c9',
    uniswapPoolStrategy: '0xD35BA61d9Bd9AFe04347D88e59A4328a65dC9F4B',
    votePowerTokenFacade: '0xc6194299cdd7f0574ad8d63e23fd33c612efff98',

    // sqcr
    sqncr: '0x15BF3fF3D8a1d147372b9ec0A92878b11D31829E',
    defaultShell: '0x5fe2B6570Dd77692D0DA409D43Eff29c2c1414D0',

    // 3P contracts
    gnosisSafe: '0x41925458151134A5324c9382915fc94C31Bce1B3',
    ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
    quickswapVibesMatic: '0x4F9e9C2EB7D90447FA190d4986b9E0A1562E2587',
    quickswapUsdcMatic: '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827',

    // misc
    multipay: '0xe7dBF1DECDee8A1990199580d2c732DD6FCBadc9',
  };
};

export type Contracts = ReturnType<typeof getContracts>;
