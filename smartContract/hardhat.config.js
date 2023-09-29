require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.19",
  
    defaultNetwork: "PegoTestnet",
    networks: {
      hardhat: {},
      PegoTestnet: {
        chainId: 123456,
        url: "https://rpc.pegotest.net/",
        accounts: [PRIVATE_KEY]
      },
      PegoMainnet: {
        chainId: 20201022,
        url: "https://node2.pegorpc.com",
        accounts: [PRIVATE_KEY]
      }
    }
  
};
