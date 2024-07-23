# OrderBook Contract

## Overview

The **OrderBook** project is a smart contract system for managing and validating orders on the Ethereum blockchain. It includes functionality for placing orders, validating signatures, and managing order details on-chain. This project also utilizes off-chain components for signature generation and IPFS data storage.

## Project Components

1. **OrderBook Contract**:
   - Stores order details on-chain.
   - Validates signatures using ecrecover() to ensure orders are genuine.
   - Emits events for order placement and verification.

2. **EnhancedOrderBook Contract** (Extension):
   - Adds functionalities for order expiration.
   - Provides additional control over orders and their lifecycle.

3. **Off-Chain Components**:
   - **Signature Generation**: Off-chain process where orders are signed by users using their private keys.
   - **IPFS**: Used to store and reference off-chain data related to orders.

## Prerequisites

- Node.js (version >= 18.0.0 recommended)
- Hardhat
- Ethereum wallet (MetaMask or similar) for deploying and interacting with the contract
- Access to the Sepolia test network or another Ethereum test network
- IPFS

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd final-project
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
     ```

## Contract Deployment

1. **Compile the Solidity code**:
   ```bash
   npx hardhat compile
   ```

2. **Deploy to Sepolia Network**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Interaction Scripts

3. **Run Interaction Scripts**:
   ```bash
   npx hardhat run scripts/interact.js --network sepolia
   npx hardhat run scripts/uploadIPFS.js --network sepolia
   npx hardhat run scripts/placeOrder.js --network sepolia
   npx hardhat run scripts/signOrder.js --network sepolia
   ```

## Local Network Testing

1. **Start Hardhat Local Node**:
   ```bash
   npx hardhat node
   ```

2. **Run Tests on Local Network**:
   Open a new terminal and run:
   ```bash
   npx hardhat test --network localhost
   ```

## Test Coverage

1. **Run Test Coverage**:
   ```bash
   npx hardhat coverage
   ```

## Testing Summary

- To test the contracts locally:
  - Start the local Hardhat node.
  - Open a new terminal and run the tests.

- To test the deployments on Sepolia:
  - Ensure your `.env` file is correctly configured with Sepolia network details.
  - Deploy the contract and run interaction scripts on the Sepolia network.

This setup ensures that you can effectively test both locally and on the Sepolia test network, with clear instructions for running and verifying each component of your project.