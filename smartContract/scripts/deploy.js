const hre = require("hardhat");

async function main() {
  // Get the accounts
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the contract
  const Research = await hre.ethers.deployContract("research");
  // const research = await Research.deploy();

  await Research.waitForDeployment();

  console.log("research Smart Contract deployed to:", Research.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });