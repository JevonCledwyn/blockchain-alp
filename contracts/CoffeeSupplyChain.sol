// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

contract CoffeeSupplyChain {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    enum State { Harvested, Processed, InTransit, InStore, Purchased }
    enum Occupation { farmer, pabrik, distributor, retailer }

    struct CoffeeBatch {
        uint id;
        string details;
        address owner;
        State state;
        address[] history;
    }

    struct Owner {
        string name;
        Occupation occupation;
    }

    mapping(uint => CoffeeBatch) public batches;
    mapping(address => Owner) public owners;
    uint public batchCounter;

    event BatchAdded(uint batchId, string details, address owner);
    event StateChanged(uint batchId, State state, address owner);
    event OwnerAdded(string name, Occupation occupation, address addr);

    modifier onlyOwner(uint batchId) {
        require(batches[batchId].owner == msg.sender, "Not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    function addOwner(string memory name, Occupation occupation, address addr) public {
        owners[addr] = Owner(name, occupation);

        emit OwnerAdded(name, occupation, addr);
    }

    function addBatch(string memory details, address _owner) public {
        CoffeeBatch storage newBatch = batches[batchCounter];
        newBatch.id = batchCounter;
        newBatch.details = details;
        newBatch.owner = _owner;
        newBatch.state = State.Harvested;
        newBatch.history.push(_owner);
        batchCounter++;

        emit BatchAdded(batchCounter, details, _owner);
    }

    function updateState(uint batchId, State state) public onlyOwner(batchId) {
        batches[batchId].state = state;
        batches[batchId].history.push(msg.sender);

        emit StateChanged(batchId, state, msg.sender);
    }

    function transferOwnership(uint batchId, address newOwner) public onlyOwner(batchId) {
        batches[batchId].owner = newOwner;
        batches[batchId].history.push(newOwner);

        emit StateChanged(batchId, batches[batchId].state, newOwner);
    }

    function getBatchHistory(uint batchId) public view returns (address[] memory) {
        return batches[batchId].history;
    }

    function getBatchDetails(uint batchId) public view returns (uint, string memory, address, State, address[] memory) {
        CoffeeBatch memory batch = batches[batchId];
        return (batch.id, batch.details, batch.owner, batch.state, batch.history);
    }
}