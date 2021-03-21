import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const localFiles = join(__dirname, '../../files');

/** recursively get all full filenames in a directory */
export const getFilenames = (directory = localFiles): string[] => {
  const allFiles = readdirSync(directory);
  const directories = allFiles.filter((f) => statSync(join(directory, f)).isDirectory());
  const nestedFiles = directories.flatMap((d) => getFilenames(join(directory, d)));
  const files = allFiles.filter((f) => statSync(join(directory, f)).isFile()).map((f) => join(directory, f));
  return [...files, ...nestedFiles];
};
