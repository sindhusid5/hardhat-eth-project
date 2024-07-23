const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SignatureVerifier", function () {
    let SignatureVerifier;
    let signatureVerifier;
    let owner;
    let buyer;

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();

        // Deploy SignatureVerifier contract
        const SignatureVerifierFactory = await ethers.getContractFactory("SignatureVerifier");
        signatureVerifier = await SignatureVerifierFactory.deploy();
        await signatureVerifier.deployed();
    });

    function getMessageHash(id, buyer, amount, price, ipfsHash) {
        return ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "string"],
            [id, buyer, amount, price, ipfsHash]
        );
    }

    async function signOrder(id, buyer, amount, price, ipfsHash) {
        const messageHash = getMessageHash(id, buyer.address, amount, price, ipfsHash);
        const signature = await buyer.signMessage(ethers.utils.arrayify(messageHash));
        return signature;
    }

    it("Should recover the correct signer from a valid signature", async function () {
        const orderId = 1;
        const amount = 100;
        const price = 50;
        const ipfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";

        const messageHash = getMessageHash(orderId, buyer.address, amount, price, ipfsHash);
        const signature = await signOrder(orderId, buyer, amount, price, ipfsHash);

        const recoveredSigner = await signatureVerifier.recoverSigner(messageHash, signature);

        expect(recoveredSigner).to.equal(buyer.address);
    });

    it("Should fail to recover the signer from an invalid signature", async function () {
        const orderId = 1;
        const amount = 100;
        const price = 50;
        const ipfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";

        const messageHash = getMessageHash(orderId, buyer.address, amount, price, ipfsHash);

        // Generate an invalid signature (length is not 65 bytes)
        const invalidSignature = "0x" + "00".repeat(64); // 64 bytes, so invalid length

        await expect(signatureVerifier.recoverSigner(messageHash, invalidSignature))
            .to.be.revertedWith("Invalid signature length");
    });

    it("Should return the correct message hash", async function () {
        const orderId = 1;
        const amount = 100;
        const price = 50;
        const ipfsHash = "QmTzQ1i1vB76hGcwoEg4n9H8N5iLRm5m8FAU5nxGNYrTA8";

        const expectedMessageHash = ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "string"],
            [orderId, buyer.address, amount, price, ipfsHash]
        );

        const actualMessageHash = await signatureVerifier.getMessageHash(
            orderId,
            buyer.address,
            amount,
            price,
            ipfsHash
        );

        expect(actualMessageHash).to.equal(expectedMessageHash);
    });

    it("Should recover the correct signer with a correct signature", async function () {
        const orderId = 2;
        const amount = 200;
        const price = 100;
        const ipfsHash = "QmS8a7W8rtZT2jN1A1P5k6L4pAB4HCVHqTx7gG6hLh9pXo";

        const messageHash = getMessageHash(orderId, buyer.address, amount, price, ipfsHash);
        const signature = await signOrder(orderId, buyer, amount, price, ipfsHash);

        const recoveredSigner = await signatureVerifier.recoverSigner(messageHash, signature);

        expect(recoveredSigner).to.equal(buyer.address);
    });

    it("Should revert when recovering signer from a signature with invalid length", async function () {
        const orderId = 3;
        const amount = 300;
        const price = 150;
        const ipfsHash = "QmT8g7V9M9FA4b5NzSCYq5nLM8v89jZm2Gftx3tT1HsYd7";

        const messageHash = getMessageHash(orderId, buyer.address, amount, price, ipfsHash);

        // Generate an invalid signature (length is not 65 bytes)
        const invalidSignature = "0x" + "01".repeat(64); // 64 bytes, so invalid length

        await expect(signatureVerifier.recoverSigner(messageHash, invalidSignature))
            .to.be.revertedWith("Invalid signature length");
    });

    it("Should revert when recovering signer from a tampered signature", async function () {
        const orderId = 4;
        const amount = 400;
        const price = 200;
        const ipfsHash = "QmZ7n8nYtxaB5kR5NuV6Z7X5AaJz4J2k8U9r7kLkZ9JrB";

        const messageHash = getMessageHash(orderId, buyer.address, amount, price, ipfsHash);
        
        // Generate a valid signature
        const validSignature = await signOrder(orderId, buyer, amount, price, ipfsHash);
        
        // Tamper with the signature
        const tamperedSignature = validSignature.slice(0, -2) + '00'; // Modify last byte to make it invalid

        await expect(signatureVerifier.recoverSigner(messageHash, tamperedSignature))
            .to.be.revertedWith("Invalid signature");
    });
});
