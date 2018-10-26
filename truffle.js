var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "sotto la panca la capra campa";

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: 5777 // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/r4rAZY7vELSbrESQ5Beu")
      },
      network_id: 3,
      gas: 4700000,
      gasPrice: 100000000000
    }
  }
};
