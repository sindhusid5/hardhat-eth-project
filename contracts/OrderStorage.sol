// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title OrderStorage
 * @dev Contract for storing and retrieving orders
 */
contract OrderStorage {
    /**
     * @dev Structure to represent an order
     * @param id The ID of the order
     * @param buyer The address of the buyer
     * @param amount The amount of the order
     * @param price The price of the order
     * @param ipfsHash The IPFS hash of the order details
     * @param verified Boolean indicating if the order is verified
     */
    struct Order {
        uint256 id;
        address buyer;
        uint256 amount;
        uint256 price;
        string ipfsHash;
        bool verified;
    }

    /**
     * @dev Mapping from order ID to Order
     */
    mapping(uint256 => Order) public orders;

    /**
     * @dev Stores an order with the given details
     * @param _id The ID of the order
     * @param _buyer The address of the buyer
     * @param _amount The amount of the order
     * @param _price The price of the order
     * @param _ipfsHash The IPFS hash of the order details
     * @param _verified Boolean indicating if the order is verified
     */
    function storeOrder(
        uint256 _id,
        address _buyer,
        uint256 _amount,
        uint256 _price,
        string memory _ipfsHash,
        bool _verified
    ) public {
        orders[_id] = Order(_id, _buyer, _amount, _price, _ipfsHash, _verified);
    }

    /**
     * @dev Retrieves an order by its ID
     * @param _id The ID of the order to retrieve
     * @return The order corresponding to the given ID
     */
    function getOrder(uint256 _id) public view returns (Order memory) {
        return orders[_id];
    }
}
