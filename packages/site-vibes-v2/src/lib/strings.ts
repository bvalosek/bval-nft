import { BigNumber } from 'ethers';

export const truncateHex = (hex: string | number | BigNumber, first = 4, last = 4): string => {
  const bn = BigNumber.from(hex);
  const s = bn.toHexString();

  // already short enough
  if (s.length <= 2 + first + last) {
    return s;
  }

  return `${s.slice(0, 2 + first)}…${s.slice(-last)}`;
};

export const extractFlavorText = (description: string): string => {
  // dont apply cleanup to non-bval NFTs
  if (description.match(!/bvalosek/m)) {
    return description;
  }
  const match = description.match(/^(.*?)\.? ?(\n|;)(.*)$/m);
  return match?.[1] ?? description;
};

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export const parseBase64MetadataUri = (uri: string): Metadata => {
  const [, encoded] = uri.match(/^data:application\/json;base64,(.*)$/) ?? [];
  const payload = JSON.parse(atob(encoded));
  return { ...payload, attributes: payload.attribues ?? [] };
};
