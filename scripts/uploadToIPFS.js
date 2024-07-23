
const FormData = require('form-data');
const fetch = require('node-fetch');
const { config } = require('dotenv');

config(); // Load environment variables

async function uploadToIPFS(data) {
    const form = new FormData();
    form.append('file', Buffer.from(data));

    const response = await fetch('http://localhost:5001/api/v0/add', {
        method: 'POST',
        body: form,
    });

    // Check if the response is in JSON format
    const textResponse = await response.text();
    try {
        const result = JSON.parse(textResponse);
        return result.Hash;
    } catch (error) {
        throw new Error(`Failed to parse JSON response: ${textResponse}`);
    }
}

async function main() {
    const data = JSON.stringify({
        orderId: 1,
        buyer: '0x1234Feb87B2721785575B63cc2046E4234a57A8B',
        amount: 100,
        price: 50,
    });

    try {
        const ipfsHash = await uploadToIPFS(data);
        console.log('IPFS Hash:', ipfsHash);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
