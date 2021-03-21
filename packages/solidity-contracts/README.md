# bval-contracts

Solidity smart contracts for the BVAL-NFT project.

## Development

Start local blockchain:

```
$ npm run blockchain:local
```

Run unit tests:

```
$ npm test
```

Compile and build all contracts:

```
$ npm run build
```

## Deployment

The following env vars must be set (`.env` in this directory will be sourced if present):

* `TEST_ENDPOINT` - Readonly Ethereum RPC endpoint for a test network
* `MAINNET_ENDPOINT` - Readonly Ethereum RPC endpoint for mainnet
* `ETHERSCAN_API` - Etherscan API key. Used for verifying contracts

