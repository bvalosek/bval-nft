declare module '@pinata/sdk' {
  function Factory(key: string, secret: string): PinataSDK;

  export interface TestAuthenticationResponse {
    authenticated: boolean;
  }

  export interface PinataMetadata {
    name?: string;
    keyvalues?: null | Record<string, string>;
  }

  export interface PinataRegion {
    id: 'NYC1' | 'FRA1';
    desiredReplicationCount: 0 | 1 | 2;
  }

  export interface PinataOptions {
    cidVersion?: 0 | 1;
    wrapWithDirectory?: boolean;
    customPinPolicy?: {
      regions: PinataRegion[];
    };
  }

  export interface PinOptions {
    pinataMetadata?: PinataMetadata;
    pinataOptions?: PinataOptions;
  }

  export interface PinResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  }

  export interface PinDetail {
    id: string;
    ipfs_pin_hash: string;
    size: number;
    user_id: string;
    date_pinned: string;
    date_unpinned: string;
    metadata: PinataMetadata;
  }

  export interface PinListResponse {
    count: number;
    rows: PinDetail[];
  }

  export interface PinataSDK {
    testAuthentication: () => Promise<TestAuthenticationResponse>;
    pinList: (filter: PinListFilter) => Promise<PinListResponse>;
    pinFromFS: (path: string, options: PinOptions) => Promise<PinResponse>;
  }

  export interface PinListFilter {
    hashContains?: string;
    status?: 'all' | 'pinned' | 'unpinned';
    pageLimit?: number;
    pageOffset?: number;
  }

  export default Factory;
}
