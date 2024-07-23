 
const { ethers } = require('ethers');
require('dotenv').config()

// Function to sign an order hash using a private key
async function signOrder(orderHash, privateKey) {
    // Create a wallet instance using the private key
    const wallet = new ethers.Wallet(privateKey);

    // Sign the order hash
    const signature = await wallet.signMessage(
        ethers.utils.arrayify(orderHash) // Convert hash to array format for signing
    );
    
    return signature;
}

// Function to generate order hash based on parameters
function generateOrderHash(id, buyer, amount, price, ipfsHash) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "uint256", "uint256", "string"],
            [id, buyer, amount, price, ipfsHash]
        )
    );
}

// Main function to demonstrate the signing process
async function main() {
    const privateKey = process.env.PRIVATE_KEY; // Replace with the private key

    // Generate an Ethereum address from the private key
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;

    // Example order parameters
    const orderId = 1;
    const buyerAddress = address; // Using the generated address as the buyer
    const amount = 10;
    const price = 100;
    const ipfsHash = process.env.IPFS_HASH;

    // Generate order hash
    const orderHash = generateOrderHash(orderId, buyerAddress, amount, price, ipfsHash);

    // Sign the order hash
    const signature = await signOrder(orderHash, privateKey);
    console.log('Order Hash:', orderHash);
    console.log('Signature:', signature);
}

main().catch(console.error);
