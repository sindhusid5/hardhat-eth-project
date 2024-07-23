require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('solidity-coverage');

const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // Adjusted to a more typical value for local testing
      gas: 15000000,  // Example: 12 million gas units
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 6000000, // A more typical value for gas limit
      gasPrice: 20000000000 // 20 gwei
    }
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 70000
  }
};
