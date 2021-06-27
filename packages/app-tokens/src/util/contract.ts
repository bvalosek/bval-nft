import { BigNumber, Contract, ContractFactory, Signer } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { BVAL721, BVAL_WELLSPRING, LOCK_MANAGER, VIBES, VIBES_WELLSPRING } from '@bvalosek/solidity-contracts';
import { SequenceCreateData, toHexStringBytes, TokenMintData } from '@bvalosek/lib-tokens';
import { useNetworkName } from './web3';

interface Contracts {
  token: string;
  nft: string;
  lock: string;
  faucet: string;
  vibes: string;
  ssw: string;
  faucetV2: string;
}

export const useContracts = (): Contracts => {
  const chain = useNetworkName();
  switch (chain) {
    case 'mainnet':
      return {
        token: '0x27525344bbba0dDb182251387AEdd0Bde7d466B2',
        nft: '0x02D91986F0C2B02830bDfC022f0dA83529B78334',
        lock: '0x0',
        faucet: '0x0',
        vibes: '0x0',
        ssw: '0x0',
        faucetV2: '0x0',
      };
    case 'rinkeby':
      return {
        token: '0x6ca2B366f63730052a6dAE39981E65F0641B9DbA',
        nft: '0x826DDe34365ec31edFbEaCcC732fA6c0813eF7DA',
        lock: '0xDa55929a39993bA4c70a850489b43AeF081ac5f0',
        faucet: '0x0',
        vibes: '0x0',
        ssw: '0x0',
        faucetV2: '0x0',
      };
    case 'polygon':
      return {
        token: '0x0',
        nft: '0x0',
        lock: '0x6Eb8E2770939F586F0B5A3C0143aB353E5Fff44c',
        faucet: '0x0',
        vibes: '0xd269af9008c674b3814b4830771453d6a30616eb',
        ssw: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4',
        faucetV2: '0x37bD35C6967B786306b6Fa201Ec5Cf5751675804',
      };
  }
};

export const getManagedTokenInfo = async (address: string, signer: Signer): Promise<void> => {
  const faucet = new Contract(address, VIBES_WELLSPRING.abi, signer);
  const count = await faucet.tokenCount();

  for (let index = 0; index < count; index++) {
    const tokenId = await faucet.tokenIdAt(index);
    const info = await faucet.tokenInfo(tokenId);
    const projected = {
      tokenId: info.tokenId.toString(),
      owner: toHexStringBytes(info.owner, 20),
      seedTimestamp: info.seedTimestamp.toNumber(),
      dailyRate: info.dailyRate.toString(),
      balance: info.balance.toString(),
      claimable: info.claimable.toString(),
      lastClaimAt: info.lastClaimAt.toNumber(),
      isBurnt: info.isBurnt,
    };
    console.log(projected);
  }

  console.log(count);
};

interface Seed {
  tokenId: string;
  dailyRateInWholeVibes: number;
  totalDays: number;
  backdateDays?: number;
}

export const seedFaucetToken = async (
  faucetAddress: string,
  tokenAddress: string,
  signer: Signer,
  { tokenId, dailyRateInWholeVibes, totalDays, backdateDays = 0 }: Seed
): Promise<void> => {
  const token = new Contract(tokenAddress, VIBES.abi, signer);
  const faucet = new Contract(faucetAddress, VIBES_WELLSPRING.abi, signer);

  const allowance = await token.allowance(await signer.getAddress(), faucetAddress);
  const rate = `${dailyRateInWholeVibes}000000000000000000`; // lol
  const amount = BigNumber.from(rate).mul(totalDays);

  if (amount.gt(allowance)) {
    const resp = await token.approve(
      faucetAddress,
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    );
    console.log(resp);
  }

  const resp = await faucet['seed(uint256,uint256,uint256,uint256)'](tokenId, rate, totalDays, backdateDays);
  console.log(resp);
};

export const grantSeederRole = async (faucetAddress: string, seederAddress: string, signer: Signer): Promise<void> => {
  const faucet = new Contract(faucetAddress, VIBES_WELLSPRING.abi, signer);
  const resp = await faucet.grantRole(await faucet.SEEDER_ROLE(), seederAddress);
  console.log(resp);
};

export const deployBVAL721 = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(BVAL721.abi, BVAL721.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const getSeeders = async (faucetAddress: string, signer: Signer): Promise<string[]> => {
  const faucet = new Contract(faucetAddress, VIBES_WELLSPRING.abi, signer);
  const role = await faucet.SEEDER_ROLE();
  const count = await faucet.getRoleMemberCount(role);
  const seeders: string[] = [];
  for (let index = 0; index < count; index++) {
    const resp = await faucet.getRoleMember(role, index);
    seeders.push(resp);
  }
  return seeders;
};

export const deployTokenLockManager = async (signer: Signer, nft: string): Promise<Contract> => {
  const factory = new ContractFactory(LOCK_MANAGER.abi, LOCK_MANAGER.bytecode, signer);
  const contract = await factory.deploy(nft);
  return contract;
};

export const deployBVALWellspring = async (signer: Signer, { nft, token }: Contracts): Promise<Contract> => {
  const factory = new ContractFactory(BVAL_WELLSPRING.abi, BVAL_WELLSPRING.bytecode, signer);
  const contract = await factory.deploy({ nft, token, lock: '0x0000000000000000000000000000000000000000' });
  return contract;
};

export const deployVIBESWellspring = async (signer: Signer, { ssw, vibes, lock }: Contracts): Promise<Contract> => {
  const factory = new ContractFactory(VIBES_WELLSPRING.abi, VIBES_WELLSPRING.bytecode, signer);
  const contract = await factory.deploy({ nft: ssw, token: vibes, lock });
  return contract;
};

export const deployVibes = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(VIBES.abi, VIBES.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const mintVibesTo = async (address: string, to: string, amount: string, signer: Signer): Promise<void> => {
  const contract = new Contract(address, VIBES.abi, signer);
  await contract.mintTo(to, amount);
};

export const atomicMint = async (
  address: string,
  sequence: SequenceCreateData,
  tokens: TokenMintData[],
  signer: Signer
): Promise<TransactionResponse> => {
  const contract = new Contract(address, BVAL721.abi, signer);
  const resp = await contract.atomicMint(sequence, tokens);
  return resp;
};
