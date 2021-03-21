import { create } from 'ipfs-core';
import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

interface IPFSFile {
  cid: string;
  path: string;
}

/** determine the CIDs for an array of absolute filenames  */
export const computeCIDs = async (filenames: string[]): Promise<IPFSFile[]> => {
  const ipfs = await create();

  const ret: IPFSFile[] = [];

  for (const filename of filenames) {
    console.log(filename);
    const buffer = await readFileAsync(filename);
    console.log(buffer);
    const file = await ipfs.add(buffer);
    ret.push({ path: filename, cid: file.cid.toString() });
  }

  await ipfs.stop();

  return ret;
};
