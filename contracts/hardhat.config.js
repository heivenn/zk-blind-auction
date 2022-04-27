/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    testnet: {
      url: "https://api.s0.b.hmny.io",
      chainId: 1666700000,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: "https://api.s0.t.hmny.io",
      chainId: 1666600000,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.11",
};
