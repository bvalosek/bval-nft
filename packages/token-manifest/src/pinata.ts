import pinataSDK, { PinataSDK, PinDetail, PinListFilter, PinOptions, PinResponse } from '@pinata/sdk';

/** create the pinata sdk */
export const getSDK = (): PinataSDK => {
  const key = process.env.PINATA_API_KEY;
  const secret = process.env.PINATA_API_SECRET;
  if (!key || !secret) {
    throw new Error('PINATA_API_KEY or PINATA_API_SECRET not set');
  }
  return pinataSDK(key, secret);
};

/** fetch all (actively) pinned items in pinata */
export const getAllPins = async (uploadTagFilter?: string): Promise<PinDetail[]> => {
  const sdk = getSDK();
  const filter: PinListFilter = {
    pageOffset: 0,
    pageLimit: 1000,
    status: 'pinned',
  };

  if (uploadTagFilter) {
    filter.metadata = {
      keyvalues: { uploadTag: { value: uploadTagFilter, op: 'eq' } },
    };
  }

  const resp = await sdk.pinList(filter);
  if (resp.count > 990) {
    throw new Error('TODO: implement paging');
  }
  return resp.rows;
};

interface UploadMetadata {
  name: string;
  tag: string;
}

/** generate the SDK metadata options from the base UploadMetadata info */
const pinOptionsFromMetadata = (metadata: UploadMetadata): PinOptions => {
  return {
    pinataMetadata: {
      name: metadata.name,
      keyvalues: {
        uploadTag: metadata.tag,
      },
    },
    pinataOptions: {
      customPinPolicy: {
        regions: [
          { id: 'NYC1', desiredReplicationCount: 2 },
          { id: 'FRA1', desiredReplicationCount: 2 },
        ],
      },
    },
  };
};

/** stream a file from disk to pinata */
export const uploadFromDisk = async (filename: string, metadata: UploadMetadata): Promise<PinResponse> => {
  const sdk = getSDK();
  const options = pinOptionsFromMetadata(metadata);
  const resp = await sdk.pinFromFS(filename, options);
  return resp;
};

/** upload data as JSON to pinata  */
export const uploadJSON = async (data: unknown, metadata: UploadMetadata): Promise<PinResponse> => {
  const sdk = getSDK();
  const options = pinOptionsFromMetadata(metadata);
  const json = JSON.parse(JSON.stringify(data));
  const resp = await sdk.pinJSONToIPFS(json, options);
  return resp;
};

export const unpin = async (ipfsHash: string): Promise<void> => {
  const sdk = getSDK();
  await sdk.unpin(ipfsHash);
};
