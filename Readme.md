 # OrderBook Contract

## Overview

The **OrderBook** project is a smart contract system for managing and validating orders on the Ethereum blockchain. It includes functionality for placing orders, validating signatures, and managing order details on-chain. This project also utilizes off-chain components for signature generation and IPFS data storage.

## Project Components

1. **OrderBook Contract**:
   - Stores order details on-chain.
   - Validates signatures using `ecrecover()` to ensure orders are genuine.
   - Emits events for order placement and verification.

2. **EnhancedOrderBook Contract** (Extension):
   - Adds functionalities for order expiration.
   - Provides additional control over orders and their lifecycle.

3. **Off-Chain Components**:
   - **Signature Generation**: Off-chain process where orders are signed by users using their private keys.
   - **IPFS**: Used to store and reference off-chain data related to orders.

## High-Level Design

The **OrderBook** system consists of two main contracts: `OrderBook` and `EnhancedOrderBook`. The `OrderBook` contract provides basic functionalities for placing orders and validating signatures. The `EnhancedOrderBook` contract extends the base functionalities by adding order expiration and additional control features. Off-chain components handle signature generation and storage of data on IPFS.

## Implementation Details

### OrderBook Contract
- **Functions**:
  - `placeOrder`: Places a new order with details including ID, buyer address, amount, price, and IPFS hash.
  - `getMessageHash`: Generates the hash of the order details.
  - `recoverSigner`: Recovers the signer's address from the signed message.
  - `getEthSignedMessageHash`: Computes the Ethereum signed message hash.
  - `splitSignature`: Splits the signature into its `r`, `s`, and `v` components.
  
### EnhancedOrderBook Contract
- **Functions**:
  - `placeOrderWithExpiry`: Places a new order with an expiration time.
  - `isOrderExpired`: Checks if an order has expired.
  - `isOrderActive`: Checks if an order is active.

### Off-Chain Components
- **Signature Generation**: Users sign orders off-chain using their private keys, ensuring the authenticity of the orders without exposing private keys on-chain.
- **IPFS**: Stores order details off-chain, reducing on-chain storage costs and enabling large data handling.

**Important:** Ensure the IPFS API URL in your environment configuration is correct to interact with the IPFS network.

## Gas Cost Optimizations

- **Use of `abi.encodePacked`**: Efficient encoding of order details to minimize gas usage.
- **Off-Chain Data Storage**: Storing data on IPFS to reduce on-chain storage costs.
- **Signature Validation**: Using `ecrecover` for efficient and secure signature validation.

## Security Considerations

- **Signature Validation**: Ensures orders are signed by the legitimate owners using `ecrecover`.
- **Data Integrity**: Uses IPFS to store data, ensuring it remains tamper-proof and verifiable.
- **Order Expiry**: Adds expiry functionality to ensure orders cannot be exploited indefinitely.

## Conclusion

This project showcases a comprehensive order management system on Ethereum, leveraging off-chain components for efficiency and security. The provided tests ensure the system is robust and reliable, meeting the project's requirements.

## Prerequisites

- Node.js (version >= 18.0.0 recommended)
- Hardhat
- Ethereum wallet (MetaMask or similar) for deploying and interacting with the contract
- Access to the Sepolia test network or another Ethereum test network
- IPFS

## Installation

1. **Clone the Repository**:
   ```bash
   cd hardhat-eth-project
     ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Create a `.env` file in the root directory.
   - Add your Ethereum private key, Infura/Alchemy project ID, and other necessary variables:
     ```env
     IPFS_API_URL=<your_IPFS_API_URL>
     INFURA_PROJECT_ID=<your_INFURA_PROJECT_ID>
     INFURA_PROJECT_SECRET=<your_INFURA_PROJECT_SECRET>
     MNEMONIC=<your_MNEMONIC>
     PRIVATE_KEY=<your_PRIVATE_KEY>
     CONTRACT_ADDRESS=<your_CONTRACT_ADDRESS>
     IPFS_HASH=<your_IPFS_HASH>
     ORDER_BOOK_ADDRESS=<your_ORDER_BOOK_ADDRESS>
     PORT=<your_PORT>
     WEB3_STORAGE_API_TOKEN=<your_WEB3_STORAGE_API_TOKEN>
     ```

## Contract Deployment - Sepolia

1. **Compile the Solidity code**:
   ```bash
   npx hardhat compile
   ```

2. **1st Terminal - Start Hardhat Local Node(for localnetwork)**:
   ```bash
   npx hardhat node
   ```

3. **2nd Terminal - Start IPFS Daemon if your using  localnetwork**:
   ```bash
   ipfs daemon
   ```

4. **Deploy to Sepolia or Localnetwork Network**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   or

  ```bash
   npx hardhat run scripts/deploy.js  
   
   ```
## Interaction Scripts

3. **Run Interaction Scripts using Sepolia Network**:
   ```bash
   npx hardhat run scripts/interact.js --network sepolia
   npx hardhat run scripts/uploadToIPFS.js --network sepolia
   npx hardhat run scripts/placeOrder.js --network sepolia
   npx hardhat run scripts/signOrder.js --network sepolia
   ```

or

   **Run Interaction Scripts using Local Network - 2nd Terminal**:
   ```bash
   npx hardhat run scripts/interact.js  
   npx hardhat run scripts/uploadToIPFS.js 
   npx hardhat run scripts/placeOrder.js 
   npx hardhat run scripts/signOrder.js  
   ```

## Testing - Local Network



2. **Run Tests - 2nd Terminal**:
   Open a new terminal and run:
   ```bash
   npx hardhat test  
   ```

## Test Coverage

1. **Run Test Coverage**:
   ```bash
   npx hardhat coverage
   ```

## Testing Summary

- To test the contracts locally (local network):
  - Start the local Hardhat node.
  - Open a new terminal and run the tests.

- To test the deployments on Sepolia:
  - Ensure your `.env` file is correctly configured with Sepolia network details.
  - Deploy the contract and run interaction scripts on the Sepolia network.

## IPFS Off-Chain Integration

### Adding Orders to IPFS

You can use the provided Express.js server to interact with IPFS. This server allows you to store order data off-chain and obtain an IPFS hash, which is then used in your smart contracts.

- **API Endpoint**: `POST /addOrder`
  - **Purpose**: Store order data on IPFS.
  - **Input**: JSON object with order details.
  - **Output**: IPFS hash of the stored order.

### Example Usage

1. **Start the Express Server**:
   ```bash
   node index.js
   ```

2. **Add Order Data**:
   Use Postman or any HTTP client to send a POST request to `http://localhost:3000/addOrder` with your order data.

3. **Use the IPFS Hash**:
   - Retrieve the IPFS hash from the response.
   - Use this hash when interacting with the smart contract to place orders.

**Ensure the server is running and correctly configured to interact with IPFS for smooth data handling.**
  
**Under UML Diagram folder you can view the UML Diagram**

