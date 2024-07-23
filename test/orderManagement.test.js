const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrderManagement", function () {
    let OrderManagement;
    let orderManagement;
    let owner;
    let buyer;

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();

        // Deploy OrderManagement contract
        const OrderManagementFactory = await ethers.getContractFactory("OrderManagement");
        orderManagement = await OrderManagementFactory.deploy();
        await orderManagement.deployed();
    });

    it("Should retrieve the correct order details", async function () {
        // Create a new order
        const orderId = 1;
        const amount = 100;
        const price = 50;
        const ipfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";
        const verified = true;

        // Directly update the order in the contract for testing
        await orderManagement.connect(owner).updateOrder(
            orderId,
            buyer.address,
            amount,
            price,
            ipfsHash,
            verified
        );

        // Fetch the order details
        const order = await orderManagement.getOrder(orderId);

        // Verify the order details
        expect(order.id).to.equal(orderId);
        expect(order.buyer).to.equal(buyer.address);
        expect(order.amount).to.equal(amount);
        expect(order.price).to.equal(price);
        expect(order.ipfsHash).to.equal(ipfsHash);
        expect(order.verified).to.equal(verified);
    });

    it("Should return default values for non-existing orders", async function () {
        // Try fetching an order that does not exist
        const nonExistingOrderId = 999;
        const order = await orderManagement.getOrder(nonExistingOrderId);

        // Verify default values
        expect(order.id).to.equal(0);
        expect(order.buyer).to.equal(ethers.constants.AddressZero);
        expect(order.amount).to.equal(0);
        expect(order.price).to.equal(0);
        expect(order.ipfsHash).to.equal("");
        expect(order.verified).to.be.false;
    });
});
