// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OrderBook.sol";

contract EnhancedOrderBook is OrderBook {
    // Error messages
    string private constant ERROR_DUPLICATE_ORDER_ID = "Order ID already exists";
    string private constant ERROR_INVALID_AMOUNT = "Amount must be greater than zero";
    string private constant ERROR_INVALID_PRICE = "Price must be greater than zero";
    string private constant ERROR_INVALID_IPFS_HASH_LENGTH = "Invalid IPFS hash length";
    string private constant ERROR_ORDER_EXPIRED = "Order has expired";

    struct EnhancedOrder {
        uint256 id;
        address buyer;
        uint256 amount;
        uint256 price;
        string ipfsHash;
        bool exists;
        uint256 expiry; // Field for order expiration
        bool canceled; // Field for order cancellation status
    }

    mapping(uint256 => EnhancedOrder) public enhancedOrders;

    /**
     * @notice Places a new order with an expiration time.
     * @param _id The ID of the order.
     * @param _buyer The address of the buyer.
     * @param _amount The amount of the order.
     * @param _price The price of the order.
     * @param _ipfsHash The IPFS hash of the order details.
     * @param _signature The signature to verify.
     * @param _expiry The expiration time of the order.
     */
    function placeOrderWithExpiry(
        uint256 _id,
        address _buyer,
        uint256 _amount,
        uint256 _price,
        string memory _ipfsHash,
        bytes memory _signature,
        uint256 _expiry // Parameter for expiration
    ) public {
        require(!enhancedOrders[_id].exists, ERROR_DUPLICATE_ORDER_ID);
        require(_amount > 0, ERROR_INVALID_AMOUNT);
        require(_price > 0, ERROR_INVALID_PRICE);
        bytes memory ipfsHashBytes = bytes(_ipfsHash);
        require(ipfsHashBytes.length == 46, ERROR_INVALID_IPFS_HASH_LENGTH); // Ensure length of IPFS hash
        require(_expiry > block.timestamp, ERROR_ORDER_EXPIRED); // Ensure expiry is in the future

        bytes32 messageHash = getMessageHash(
            _id,
            _buyer,
            _amount,
            _price,
            _ipfsHash
        );
        address recoveredSigner = recoverSigner(messageHash, _signature);
        require(recoveredSigner == _buyer, "Invalid signature");

        enhancedOrders[_id] = EnhancedOrder(
            _id,
            _buyer,
            _amount,
            _price,
            _ipfsHash,
            true,
            _expiry,
            false
        );

        emit OrderPlaced(_id, _buyer, _amount, _price, _ipfsHash);
        emit OrderVerified(_id, true);
    }

    /**
     * @notice Checks if an order has expired.
     * @param _id The ID of the order.
     * @return True if the order has expired, otherwise false.
     */
    function isOrderExpired(uint256 _id) public view returns (bool) {
        EnhancedOrder storage order = enhancedOrders[_id];
        require(order.exists, "Order does not exist");
        return block.timestamp > order.expiry;
    }

    /**
     * @notice Checks if an order is active.
     * @param _id The ID of the order.
     * @return True if the order is active, otherwise false.
     */
    function isOrderActive(uint256 _id) public view returns (bool) {
        EnhancedOrder storage order = enhancedOrders[_id];
        return order.exists && !order.canceled && !isOrderExpired(_id);
    }
}
