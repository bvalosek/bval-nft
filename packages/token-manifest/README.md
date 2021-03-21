# token-manifest

The source files and build/upload steps for managing the token asset and metadata files.

Uses Pinata for IPFS pinning and ipfs-node for fast CID computation.

## Building

The following env vars must be set (`.env` in this directory will be sourced if present):

* `PINATA_API_KEY` - Pinata API key value
* `PINATA_API_SECRET` - Pinata API secret value
