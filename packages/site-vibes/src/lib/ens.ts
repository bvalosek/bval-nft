import { Contract } from 'ethers';
import { getEthProvider } from './rpc';
import REVERSE_RECORDS from './abi/ens-reverse-records.json';

// https://github.com/ensdomains/reverse-records
const reverseRecordsAddress = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';

export const lookupEnsNames = async (addresses: string[]): Promise<Record<string, string | undefined>> => {
  const rr = new Contract(reverseRecordsAddress, REVERSE_RECORDS, getEthProvider());

  const names: string[] = await rr['getNames(address[])'](addresses);

  const map: Record<string, string | undefined> = {};
  for (const [idx, name] of names.entries()) {
    const address = addresses[idx];
    map[address] = name ? name : undefined;
  }

  return map;
};

export const lookupEnsName = async (address: string): Promise<string | undefined> => {
  const names = await lookupEnsNames([address]);
  return names[address];
};
