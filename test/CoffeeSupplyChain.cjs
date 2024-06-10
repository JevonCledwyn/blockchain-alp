const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test Functions", function () {

  it("addOwner Function", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await expect(coffeeSupplyChain.addOwner("Farmer Joe", 0, owner.address)).to.emit(coffeeSupplyChain, "OwnerAdded").withArgs("Farmer Joe", 0, owner.address);
  });

  it("addBatch", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await coffeeSupplyChain.addBatch("Fresh Coffee", addr1.address);
    const batch = await coffeeSupplyChain.batches(0);
    expect(batch.details).to.equal("Fresh Coffee");
    expect(batch.owner).to.equal(addr1.address);
    expect(batch.state).to.equal(0);
  });


  it("Should update the state of a coffee batch", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await coffeeSupplyChain.addBatch("Fresh Coffee", addr1.address);
    await coffeeSupplyChain.connect(addr1).updateState(0, 1); // 1 is State.Processed
    const batch = await coffeeSupplyChain.batches(0);
    expect(batch.state).to.equal(1);
  });

  it("Should transfer the ownership of a coffee batch", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await coffeeSupplyChain.addBatch("Fresh Coffee", addr1.address);
    await coffeeSupplyChain.connect(addr1).transferOwnership(0, addr2.address);
    const batch = await coffeeSupplyChain.batches(0);
    expect(batch.owner).to.equal(addr2.address);
  });

  it("Should get batch history", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await coffeeSupplyChain.addBatch("Fresh Coffee", addr1.address);
    await coffeeSupplyChain.connect(addr1).transferOwnership(0, addr2.address);
    const history = await coffeeSupplyChain.getBatchHistory(0);
    expect(history.length).to.equal(2);
    expect(history[0]).to.equal(addr1.address);
    expect(history[1]).to.equal(addr2.address);
  });

  it("Should get batch details", async function () {
    const CoffeeSupplyChain = await ethers.getContractFactory("CoffeeSupplyChain");
    const coffeeSupplyChain = await CoffeeSupplyChain.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners();
    await coffeeSupplyChain.addBatch("Fresh Coffee", addr1.address);
    const batch = await coffeeSupplyChain.getBatchDetails(0);
    expect(batch[0]).to.equal(0); // id
    expect(batch[1]).to.equal("Fresh Coffee"); // details
    expect(batch[2]).to.equal(addr1.address); // owner
    expect(batch[3]).to.equal(0); // state (State.Harvested)
  });
});