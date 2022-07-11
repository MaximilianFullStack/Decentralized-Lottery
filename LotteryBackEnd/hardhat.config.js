require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("hardhat-contract-sizer")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      blockConfirmations: 1,
    },
    localhost: {
      url: "",
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_URL || "",
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    noColors: true,
    outputFile: "gas-report.txt",
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
}
