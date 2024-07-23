const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const OrderBook = await hre.ethers.getContractFactory("OrderBook");
    const orderBook = await OrderBook.deploy();
    await orderBook.deployed(); // Make sure the deployment is completed
    console.log("OrderBook deployed to:", orderBook.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
