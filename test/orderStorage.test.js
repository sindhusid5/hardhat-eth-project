const { expect } = require("chai");

describe("OrderStorage", function () {
    let OrderStorage;
    let orderStorage;
    let owner;
    let otherAccount;

    beforeEach(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        // Deploy OrderStorage contract
        const OrderStorageFactory = await ethers.getContractFactory("OrderStorage");
        orderStorage = await OrderStorageFactory.deploy();
        await orderStorage.deployed();

        //console.log(`OrderStorage deployed to: ${orderStorage.address}`);
    });

    it("Should deploy the contract successfully", async function () {
        expect(orderStorage.address).to.be.a('string');
        expect(orderStorage.address).to.have.lengthOf(42); // Check for valid address length
    });

    it("Should store and retrieve an order successfully", async function () {
        const orderId = 1;
        const amount = 100;
        const price = 50;
        const ipfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";
        const verified = true;

        // Store the order
        await orderStorage.storeOrder(orderId, owner.address, amount, price, ipfsHash, verified);

        // Retrieve the order
        const order = await orderStorage.getOrder(orderId);

        expect(order.id).to.equal(orderId);
        expect(order.buyer).to.equal(owner.address);
        expect(order.amount).to.equal(amount);
        expect(order.price).to.equal(price);
        expect(order.ipfsHash).to.equal(ipfsHash);
        expect(order.verified).to.be.true;
    });

    it("Should handle storing multiple orders", async function () {
        const orderId1 = 2;
        const orderId2 = 3;

        const amount1 = 200;
        const price1 = 75;
        const ipfsHash1 = "QmSomeHash1";
        const verified1 = false;

        const amount2 = 300;
        const price2 = 100;
        const ipfsHash2 = "QmSomeHash2";
        const verified2 = true;

        // Store the first order
        await orderStorage.storeOrder(orderId1, owner.address, amount1, price1, ipfsHash1, verified1);

        // Store the second order
        await orderStorage.storeOrder(orderId2, otherAccount.address, amount2, price2, ipfsHash2, verified2);

        // Retrieve the first order
        const order1 = await orderStorage.getOrder(orderId1);
        expect(order1.id).to.equal(orderId1);
        expect(order1.buyer).to.equal(owner.address);
        expect(order1.amount).to.equal(amount1);
        expect(order1.price).to.equal(price1);
        expect(order1.ipfsHash).to.equal(ipfsHash1);
        expect(order1.verified).to.be.false;

        // Retrieve the second order
        const order2 = await orderStorage.getOrder(orderId2);
        expect(order2.id).to.equal(orderId2);
        expect(order2.buyer).to.equal(otherAccount.address);
        expect(order2.amount).to.equal(amount2);
        expect(order2.price).to.equal(price2);
        expect(order2.ipfsHash).to.equal(ipfsHash2);
        expect(order2.verified).to.be.true;
    });
});
