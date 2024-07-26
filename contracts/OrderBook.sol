// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SignatureVerifier.sol";

/**
 * @title OrderBook
 * @author Sindhuja Rajakkani
 * @dev Contract for managing orders with off-chain signature verification
 */
contract OrderBook is SignatureVerifier {
    // Error messages
    string private constant ERROR_DUPLICATE_ORDER_ID = "Order ID already exists";
    string private constant ERROR_INVALID_AMOUNT = "Amount must be greater than zero";
    string private constant ERROR_INVALID_PRICE = "Price must be greater than zero";
    string private constant ERROR_INVALID_IPFS_HASH_LENGTH = "Invalid IPFS hash length";

    // Order structure
    struct Order {
        uint256 id;
        address buyer;
        uint256 amount;
        uint256 price;
        string ipfsHash;
        bool exists;
    }

    // Mapping from order ID to Order
    mapping(uint256 => Order) public orders;

    // Events
    /**
     * @dev Emitted when a new order is placed
     * @param id The ID of the order
     * @param buyer The address of the buyer
     * @param amount The amount of the order
     * @param price The price of the order
     * @param ipfsHash The IPFS hash of the order details
     */
    event OrderPlaced(
        uint256 indexed id,
        address indexed buyer,
        uint256 amount,
        uint256 price,
        string ipfsHash
    );

    /**
     * @dev Emitted when an order is verified
     * @param id The ID of the order
     * @param verified Boolean indicating if the order is verified
     */
    event OrderVerified(uint256 indexed id, bool verified);

    /**
     * @dev Places a new order with off-chain signature verification
     * @param _id The ID of the order
     * @param _buyer The address of the buyer
     * @param _amount The amount of the order
     * @param _price The price of the order
     * @param _ipfsHash The IPFS hash of the order details
     * @param _signature The signature of the buyer
     */
    function placeOrder(
        uint256 _id,
        address _buyer,
        uint256 _amount,
        uint256 _price,
        string memory _ipfsHash,
        bytes memory _signature
    ) public {
        // Check if the order ID already exists
        require(!orders[_id].exists, ERROR_DUPLICATE_ORDER_ID);

        // Validate amount and price
        require(_amount > 0, ERROR_INVALID_AMOUNT);
        require(_price > 0, ERROR_INVALID_PRICE);

        // Validate IPFS hash length (46 bytes for base58-encoded IPFS hash)
        bytes memory ipfsHashBytes = bytes(_ipfsHash);
        require(ipfsHashBytes.length == 46, ERROR_INVALID_IPFS_HASH_LENGTH);

        // Generate message hash and recover the signer
        bytes32 messageHash = getMessageHash(
            _id,
            _buyer,
            _amount,
            _price,
            _ipfsHash
        );
        address recoveredSigner = recoverSigner(messageHash, _signature);

        // Verify the signature
        require(recoveredSigner == _buyer, "Invalid signature");

        // Store the order details on-chain
        orders[_id] = Order(_id, _buyer, _amount, _price, _ipfsHash, true);

        // Emit events
        emit OrderPlaced(_id, _buyer, _amount, _price, _ipfsHash);
        emit OrderVerified(_id, true);
    }
}
