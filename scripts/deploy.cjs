const path = require("path");
const fs = require("fs");
const { ethers, network, artifacts } = require("hardhat");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        " gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
  const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
  // await coffeeSupplyChain.deployed(); // Wait until the contract is deployed

  console.log("CoffeeSupplyChain smart contract address:", coffeeSupplyChain.target);

  
  console.log("Initial owners added.");

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(coffeeSupplyChain);
}

function saveFrontendFiles(coffeeSupplyChain) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ CoffeeSupplyChain: coffeeSupplyChain.target }, undefined, 2)
  );

  const CoffeeSupplyChainArtifact = artifacts.readArtifactSync("CoffeeSupplyChain");

  fs.writeFileSync(
    path.join(contractsDir, "CoffeeSupplyChain.json"),
    JSON.stringify(CoffeeSupplyChainArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
