# token-manifest

The source files and build/upload steps for managing the token asset and metadata files.

Uses Pinata for IPFS pinning.

## Overview

This package contains the "source data" for my NFTs. This allows me to define and store all data/assets that are transformed into the actual NFT outputs (such as processed images and prepared metadata).

No re-processing will occur for tokens that already exists, and generated files are checked into the repo intentionally. This is because the asset generation / preparation steps and functionality will evolve over time, but I want a concrete record of the actual minted information that is immutable on-chain.

## Building

The following env vars must be set (`.env` in this directory will be sourced if present):

* `PINATA_API_KEY` - Pinata API key value
* `PINATA_API_SECRET` - Pinata API secret value

To process and upload any tokens not yet processed:

```
$ npm run build
```

This will update the files in `./data` if there is anything new.

**NOTE**: token data will not be re-generated if it already present in the data file outputs. This is intentional, as this information is immutable once the token is minted.
