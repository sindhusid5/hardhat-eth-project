
const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const { ethers } = require("hardhat");
const { keccak256, defaultAbiCoder, arrayify } = require("ethers/lib/utils");

describe("OrderBook", function () {
  let OrderBook;
  let orderBook;
  let owner;
  let buyer;
  let otherAccount;

  const IPFS_HASH = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";

  beforeEach(async function () {
    [owner, buyer, otherAccount] = await ethers.getSigners();

    // Deploy OrderBook contract
    const OrderBookFactory = await ethers.getContractFactory("OrderBook");
    orderBook = await OrderBookFactory.deploy();
    await orderBook.deployed();

    console.log(`OrderBook deployed to: ${orderBook.address}`);
  });

  function getMessageHash(id, buyer, amount, price, ipfsHash) {
    return keccak256(defaultAbiCoder.encode(
      ["uint256", "address", "uint256", "uint256", "string"],
      [id, buyer, amount, price, ipfsHash]
    ));
  }

  async function signOrder(id, buyer, amount, price, ipfsHash) {
    const messageHash = getMessageHash(id, buyer.address, amount, price, ipfsHash);
    const ethSignedMessageHash = ethers.utils.hashMessage(arrayify(messageHash));
    const signature = await buyer.signMessage(arrayify(messageHash));
    return signature;
  }

  it("Should deploy the contract successfully", async function () {
    expect(orderBook.address).to.be.a('string');
    expect(orderBook.address).to.have.lengthOf(42); // Checking for valid address length
  });

  it("Should fail when amount is zero", async function () {
    const orderId = 3;
    const amount = 0; // Invalid amount
    const price = 1;

    const signature = await signOrder(orderId, buyer, amount, price, IPFS_HASH);

    await expect(orderBook.placeOrder(orderId, buyer.address, amount, price, IPFS_HASH, signature))
      .to.be.revertedWith("Amount must be greater than zero");
  });

  it("Should fail when price is zero", async function () {
    const orderId = 4;
    const amount = 100;
    const price = 0; // Invalid price

    const signature = await signOrder(orderId, buyer, amount, price, IPFS_HASH);

    await expect(orderBook.placeOrder(orderId, buyer.address, amount, price, IPFS_HASH, signature))
      .to.be.revertedWith("Price must be greater than zero");
  });

  it("Should fail when IPFS hash length is invalid", async function () {
    const orderId = 5;
    const amount = 100;
    const price = 1;
    const invalidIpfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5"; // Too short

    const signature = await signOrder(orderId, buyer, amount, price, invalidIpfsHash);

    await expect(orderBook.placeOrder(orderId, buyer.address, amount, price, invalidIpfsHash, signature))
      .to.be.revertedWith("Invalid IPFS hash length");
  });

  it("Should fail when signature is invalid", async function () {
    const orderId = 6;
    const amount = 100;
    const price = 1;

    const invalidSignature = "0x" + "00".repeat(65); // Invalid signature format

    await expect(orderBook.placeOrder(orderId, buyer.address, amount, price, IPFS_HASH, invalidSignature))
      .to.be.revertedWith("Invalid signature");
  });


});
