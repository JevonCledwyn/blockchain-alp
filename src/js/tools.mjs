import { ethers } from "ethers";
import CoffeeSupplyChainArtifact from "../contracts/CoffeeSupplyChain.json" assert { type: "json" };
import contractAddress from "../contracts/contract-address.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider("http://localhost:8545");

export async function constructSmartContract() {
  return (new ethers.Contract(ethers.getAddress(contractAddress.CoffeeSupplyChain), CoffeeSupplyChainArtifact.abi, await provider.getSigner(0)));
}
