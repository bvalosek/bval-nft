import { BigNumber } from 'ethers';

interface ProtocolView {
  vibesToken: {
    admins: string[];
    minters: string[];
    minterAdmins: string[];
  };
  wellspring: {
    admins: string[];
    seeders: string[];
    seederAdmins: string[];
    tokenCount: number;
    reserveBalance: BigNumber;
  };
  sqncr: {
    admins: string[];
    config: string[];
    withdraw: string[];
    maxMints: number;
    totalMinted: number;
  };
  gnosisSafe: {
    maticBalance: BigNumber;
    vibesBalance: BigNumber;
    vibesMaticLpBalance: BigNumber;
  };
}

export const getProtocolView = async (): Promise<ProtocolView> => {};
