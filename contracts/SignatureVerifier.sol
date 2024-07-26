// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SignatureVerifier {
    // Error messages
    string private constant ERROR_INVALID_SIGNATURE_LENGTH = "Invalid signature length";
    string private constant ERROR_INVALID_SIGNATURE = "Invalid signature";

    /**
     * @dev Computes the hash of the message to be signed.
     * @param _id Order ID.
     * @param _buyer Address of the buyer.
     * @param _amount Amount of the order.
     * @param _price Price of the order.
     * @param _ipfsHash IPFS hash of the order details.
     * @return The computed message hash.
     */
    function getMessageHash(
        uint256 _id,
        address _buyer,
        uint256 _amount,
        uint256 _price,
        string memory _ipfsHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_id, _buyer, _amount, _price, _ipfsHash));
    }

    /**
     * @dev Recovers the signer's address from a signed message.
     * @param _messageHash The hash of the message.
     * @param _signature The signature to verify.
     * @return The address of the signer.
     */
    function recoverSigner(bytes32 _messageHash, bytes memory _signature) public pure returns (address) {
        require(_signature.length == 65, ERROR_INVALID_SIGNATURE_LENGTH);

        bytes32 ethSignedMessageHash = getEthSignedMessageHash(_messageHash);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        address signer = ecrecover(ethSignedMessageHash, v, r, s);
        require(signer != address(0), ERROR_INVALID_SIGNATURE);

        return signer;
    }

    /**
     * @dev Computes the Ethereum signed message hash of the given message hash.
     * @param _messageHash The original message hash.
     * @return The Ethereum signed message hash.
     */
    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    /**
     * @dev Splits the signature into r, s, and v components.
     * @param sig The signature to split.
     * @return r The r component of the signature.
     * @return s The s component of the signature.
     * @return v The v component of the signature.
     */
    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, ERROR_INVALID_SIGNATURE_LENGTH);

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (r, s, v);
    }
}