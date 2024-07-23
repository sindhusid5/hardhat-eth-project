const { ethers } = require('hardhat');
const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

config(); // Load environment variables

async function uploadToIPFS(data) {
    const form = new FormData();
    form.append('file', Buffer.from(data));

    const response = await fetch('http://localhost:5001/api/v0/add', {
        method: 'POST',
        body: form,
    });

    const textResponse = await response.text();
    try {
        const result = JSON.parse(textResponse);
        return result.Hash;
    } catch (error) {
        throw new Error(`Failed to parse JSON response: ${textResponse}`);
    }
}

function getContractABI(contractName) {
    const abiPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    console.log("ABI path:", abiPath);

    const contractJSON = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    return contractJSON.abi;
}

async function main() {
    const data = JSON.stringify({
        orderId: 1,
        buyer: '0x1234Feb87B2721785575B63cc2046E4234a57A8B',
        amount: 100,
        price: 50,
    });

    let ipfsHash;
    try {
        ipfsHash = await uploadToIPFS(data);
        console.log('IPFS Hash:', ipfsHash);
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        process.exit(1);
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL); // Add your Infura URL here
    const [deployer] = await ethers.getSigners();
    console.log('Interacting with the contract using the account:', deployer.address);

    const contractName = 'OrderBook'; // Replace with your contract name
    const contractAddress = process.env.CONTRACT_ADDRESS; // Ensure this is in your .env file

    let contractABI;
    try {
        contractABI = getContractABI(contractName);
    } catch (error) {
        console.error('Error reading contract ABI:', error);
        process.exit(1);
    }

    const contract = new ethers.Contract(contractAddress, contractABI, deployer);

    const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "address", "uint256", "uint256", "string"],
        [1, deployer.address, 100, 50, ipfsHash]
    );

    const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));

    try {
        const tx = await contract.placeOrder(
            1, // _id
            deployer.address, // _buyer
            100, // _amount
            50, // _price
            ipfsHash, // _ipfsHash
            signature // _signature
        );
        await tx.wait();
        console.log('Transaction successful:', tx.hash);
    } catch (error) {
        console.error('Error interacting with the contract:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
