const express = require('express');
const { Web3Storage } = require('web3.storage');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Web3.Storage client
const client = new Web3Storage({ token: process.env.WEB3_STORAGE_API_TOKEN });

app.use(express.json());

async function addOrderToIPFS(orderData) {
    try {
        const cid = await client.put([new File([JSON.stringify(orderData)], 'order.json')]);
        console.log(`Order added to IPFS with CID: ${cid}`);
        return cid;
    } catch (error) {
        console.error('Error adding order to IPFS:', error);
        throw error;
    }
}

app.post('/addOrder', async (req, res) => {
    const { id, buyer, amount, price } = req.body;

    if (!id || !buyer || !amount || !price) {
        return res.status(400).json({ error: 'All order fields (id, buyer, amount, price) are required' });
    }

    try {
        const orderData = { id, buyer, amount, price };
        const ipfsCid = await addOrderToIPFS(orderData);
        res.status(200).json({ ipfsCid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to store order data on IPFS' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
