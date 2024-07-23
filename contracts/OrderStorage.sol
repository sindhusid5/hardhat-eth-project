// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderStorage {
    struct Order {
        uint256 id;
        address buyer;
        uint256 amount;
        uint256 price;
        string ipfsHash;
        bool verified;
    }

    mapping(uint256 => Order) public orders;

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

    function getOrder(uint256 _id) public view returns (Order memory) {
        return orders[_id];
    }
}
