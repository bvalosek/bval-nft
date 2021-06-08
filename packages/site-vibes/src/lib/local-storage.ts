const prefixed = (key: string): string => `vibes:${key}`;

/** write to local storage */
export function storageSet(key: string, value: unknown): void {
  const item = JSON.stringify(value);
  localStorage.setItem(prefixed(key), item);
}

/** read from local storage */
export function storageGet<T>(key: string): T | null {
  const item = localStorage.getItem(prefixed(key));

  if (item === null) {
    return null;
  }

  const value = JSON.parse(item);
  return value;
}

/** wipe storage */
export function storageRemove(key: string): void {
  localStorage.removeItem(prefixed(key));
}
