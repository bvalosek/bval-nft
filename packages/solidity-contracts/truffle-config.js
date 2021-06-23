/* eslint-disable @typescript-eslint/no-var-requires */

const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();

const { TEST_ENDPOINT, MAINNET_ENDPOINT, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777,
      skipDryRun: true,
    },
    testnet: {
      provider: () => new HDWalletProvider({ provider: TEST_ENDPOINT }),
      network_id: 4,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mainnet: {
      provider: () => new HDWalletProvider({ provider: MAINNET_ENDPOINT }),
      network_id: 1,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    polygon: {
      provider: () => new HDWalletProvider({ provider: 'https://rpc-mainnet.matic.network' }),
      network_id: 137,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.8.1',
      settings: {
        optimizer: {
          enabled: true,
          runs: 1,
        },
      },
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
    polygonscan: POLYGONSCAN_API_KEY,
  },
};
