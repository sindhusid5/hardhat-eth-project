const IPFS = require('ipfs-http-client');
const { createHash } = require('crypto');
require('dotenv').config();

const client = IPFS.create({ url: process.env.IPFS_API_URL });

async function addOrderToIPFS(orderData) {
    const { path } = await client.add(JSON.stringify(orderData));
    console.log(`Order added to IPFS with hash: ${path}`);
    return path;
}

const orderData = {
    id: 1,
    buyer: "0x123...",
    amount: "1.0",
    price: "0.1"
};

addOrderToIPFS(orderData).catch(console.error);
