import sharp from 'sharp';
import { join, dirname } from 'path';
import mkdirp from 'mkdirp';

/** write a source image as a resampled jaypeg */
export const writeResampledImage = async (inputAssetPath: string): Promise<string> => {
  const inputPath = join(__dirname, './assets', inputAssetPath);
  const outputPath = join(__dirname, '../data/processed', inputAssetPath.replace(/\.png$/, '.resampled.jpg'));
  await mkdirp(dirname(outputPath));
  await sharp(inputPath).jpeg({ quality: 85, chromaSubsampling: '4:4:4' }).toFile(outputPath);
  return outputPath;
};
