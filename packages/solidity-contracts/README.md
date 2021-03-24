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

Verify NFT contract on Rinkeby:

```
$ npx truffle --network testnet run verify BVAL721@$CONTRACT_ADDRESS
```

Verify NFT contract on mainnet:

```
$ npx truffle --network mainnet run verify BVAL721@$CONTRACT_ADDRESS
```

## Deployment

The following env vars must be set (`.env` in this directory will be sourced if present):

* `TEST_ENDPOINT` - Readonly Ethereum RPC endpoint for a test network
* `MAINNET_ENDPOINT` - Readonly Ethereum RPC endpoint for mainnet
* `ETHERSCAN_API` - Etherscan API key. Used for verifying contracts

