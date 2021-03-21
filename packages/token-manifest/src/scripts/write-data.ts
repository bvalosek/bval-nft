import { createToken } from '@bvalosek/lib-tokens';
import { tokens } from '../tokens';
import { join } from 'path';

const assetPath = (filename: string): string => join(__dirname, '../assets', filename);

const writeData = async () => {
  const compiled = tokens.map((t) => {
    const token = createToken(t.token);
    const assetFilename = assetPath(t.image);
    console.log(assetFilename);
  });
};

writeData();
