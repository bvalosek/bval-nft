import pinataSDK, { PinataSDK, PinDetail, PinOptions, PinResponse } from '@pinata/sdk';

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
export const getAllPins = async (): Promise<PinDetail[]> => {
  const sdk = getSDK();
  const resp = await sdk.pinList({
    pageLimit: 1000,
    pageOffset: 0,
    status: 'pinned',
  });
  if (resp.count > 990) {
    throw new Error('TODO: implement paging');
  }
  return resp.rows;
};

interface UploadMetadata {
  name: string;
  tag: string;
}

export const upload = async (filename: string, metadata: UploadMetadata): Promise<PinResponse> => {
  const sdk = getSDK();
  const options: PinOptions = {
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
  const resp = await sdk.pinFromFS(filename, options);

  return resp;
};
