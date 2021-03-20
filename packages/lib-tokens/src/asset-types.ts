export const assetTypes = {
  PNG: 1,
  JPEG: 2,
  GIF: 3,
};

/** string-encoded asset types */
export type AssetType = keyof typeof assetTypes;

/** get the asset type index by name */
export const assetTypeIndex = (type: AssetType): number => assetTypes[type];

/** get the asset type name by index */
export const assetTypeName = (index: number): AssetType => {
  const entry = Object.entries(assetTypes).find(([, v]) => v === index);
  if (!entry) {
    throw new Error(`invalid asset type: ${index}`);
  }
  return entry[0] as AssetType;
};
