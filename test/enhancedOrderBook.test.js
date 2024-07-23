// test/EnhancedOrderBook.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnhancedOrderBook", function () {
    let EnhancedOrderBook;
    let enhancedOrderBook;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Deploy the contract before each test
        [owner, addr1, addr2] = await ethers.getSigners();

        const OrderBook = await ethers.getContractFactory("OrderBook");
        const orderBook = await OrderBook.deploy();
        await orderBook.deployed();

        EnhancedOrderBook = await ethers.getContractFactory("EnhancedOrderBook");
        enhancedOrderBook = await EnhancedOrderBook.deploy();
        await enhancedOrderBook.deployed();
    });

    it("should place an order with expiry", async function () {
        const orderId = 1;
        const amount = ethers.utils.parseEther("1");
        const price = ethers.utils.parseEther("0.1");
        const ipfsHash = "QmT5NvUtoM5nJ6ZfQ6kArJ64xkU3Z9RvZdxHgg3mo9A2Zq";
        const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        const messageHash = ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "string"],
            [orderId, addr1.address, amount, price, ipfsHash]
        );

        const signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

        await expect(enhancedOrderBook.placeOrderWithExpiry(
            orderId,
            addr1.address,
            amount,
            price,
            ipfsHash,
            signature,
            expiry
        )).to.emit(enhancedOrderBook, "OrderPlaced")
          .withArgs(orderId, addr1.address, amount, price, ipfsHash);

        const order = await enhancedOrderBook.enhancedOrders(orderId);
        expect(order.exists).to.be.true;
        expect(order.buyer).to.equal(addr1.address);
        expect(order.amount.toString()).to.equal(amount.toString());
        expect(order.price.toString()).to.equal(price.toString());
        expect(order.ipfsHash).to.equal(ipfsHash);
        expect(order.expiry.toString()).to.equal(expiry.toString());
    });

     it("should verify if an order is active", async function () {
        const orderId = 3;
        const amount = ethers.utils.parseEther("3");
        const price = ethers.utils.parseEther("0.3");
        const ipfsHash = "QmT5NvUtoM5nJ6ZfQ6kArJ64xkU3Z9RvZdxHgg3mo9A2Zs";
        const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        const messageHash = ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "string"],
            [orderId, addr1.address, amount, price, ipfsHash]
        );

        const signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

        await enhancedOrderBook.placeOrderWithExpiry(
            orderId,
            addr1.address,
            amount,
            price,
            ipfsHash,
            signature,
            expiry
        );

        const isActive = await enhancedOrderBook.isOrderActive(orderId);
        expect(isActive).to.be.true;
    });
});
