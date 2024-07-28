const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    moonbase: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://rpc.api.moonbase.moonbeam.network'),
      network_id: 1287,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  }
};