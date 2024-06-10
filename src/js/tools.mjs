import { ethers } from "ethers";
import CoffeeSupplyChainArtifact from "../contracts/CoffeeSupplyChain.json" assert { type: "json" };
import contractAddress from "../contracts/contract-address.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider("http://localhost:8545");

export async function constructSmartContract() {
  const signer = provider.getSigner();
  if (!contractAddress.CoffeeSupplyChain) {
    throw new Error("Contract address is not defined in contract-address.json");
  }
  return new ethers.Contract(contractAddress.CoffeeSupplyChain, CoffeeSupplyChainArtifact.abi, signer);
}
