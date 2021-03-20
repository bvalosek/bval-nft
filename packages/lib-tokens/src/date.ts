import { BigNumber } from 'ethers';
import { Numberish, toBN } from './util';

/** YYYY-MM-DD to bytes2 */
export const serializeDate = (date: string): BigNumber => {
  const match = date.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
  if (!match) {
    throw new Error(`invalid date: ${date}`);
  }

  const timestamp = new Date(date).getTime() / 1000;
  const daystamp = timestamp / 60 / 60 / 24;
  const serialized = toBN(daystamp);

  return serialized;
};

/** bytes2 to YYYY-MM-DD */
export const parseDate = (encodedDate: Numberish): string => {
  const daystamp = toBN(encodedDate).toNumber();
  const timestamp = daystamp * 60 * 60 * 24;
  const date = new Date(timestamp * 1000);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const y = `${year}`;
  const m = month < 10 ? `0${month}` : `${month}`;
  const d = day < 10 ? `0${day}` : `${day}`;

  return `${y}-${m}-${d}`;
};
