const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    // Get the signer (the account used for transactions)
    const [signer] = await ethers.getSigners();

    // Replace with the actual deployed contract address
    const orderBookAddress = process.env.ORDER_BOOK_ADDRESS; 

    // Get the OrderBook contract factory and attach to the deployed contract
    const OrderBook = await ethers.getContractFactory("OrderBook");
    const orderBook = await OrderBook.attach(orderBookAddress);

    // Define order parameters
    const id = 1;
    const buyer = signer.address;
    const amount = ethers.utils.parseUnits("1.0", "ether"); // Convert to wei
    const price = ethers.utils.parseUnits("0.1", "ether"); // Convert to wei
    const ipfsHash = process.env.IPFS_HASH; 

    // Prepare the message to be signed
    const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "address", "uint256", "uint256", "string"],
        [id, buyer, amount, price, ipfsHash]
    );

    // Sign the message
    const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));

    // Send the order to the contract
    const tx = await orderBook.placeOrder(id, buyer, amount, price, ipfsHash, signature);
    await tx.wait();

    console.log(`Order placed with ID: ${id}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
