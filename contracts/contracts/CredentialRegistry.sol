// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CredentialRegistry
 * @dev Immutable registry for decentralized credential proofs. 
 * Stores the cryptographic hash of a credential and its validity status.
 */
contract CredentialRegistry {
    address public admin;

    enum Status { NONE, VALID, REVOKED }

    struct Credential {
        address issuer;
        uint256 issuedAt;
        Status status;
    }

    // Mapping from Credential Hash (SHA-256) to Credential Record
    mapping(bytes32 => Credential) public credentials;

    // Mapping of authorized institutions
    mapping(address => bool) public authorizedIssuers;

    event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, uint256 timestamp);
    event CredentialRevoked(bytes32 indexed credentialHash, address indexed issuer, uint256 timestamp);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: Admin only");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not authorized: Issuer only");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedIssuers[msg.sender] = true; // Admin is also an issuer by default
    }

    function addIssuer(address _issuer) external onlyAdmin {
        authorizedIssuers[_issuer] = true;
        emit IssuerAdded(_issuer);
    }

    function removeIssuer(address _issuer) external onlyAdmin {
        authorizedIssuers[_issuer] = false;
        emit IssuerRemoved(_issuer);
    }

    function issueCredential(bytes32 _credentialHash) external onlyIssuer {
        require(credentials[_credentialHash].status == Status.NONE, "Credential already exists");

        credentials[_credentialHash] = Credential({
            issuer: msg.sender,
            issuedAt: block.timestamp,
            status: Status.VALID
        });

        emit CredentialIssued(_credentialHash, msg.sender, block.timestamp);
    }

    function revokeCredential(bytes32 _credentialHash) external {
        Credential storage cred = credentials[_credentialHash];
        require(cred.status == Status.VALID, "Credential not valid or does not exist");
        require(cred.issuer == msg.sender, "Not authorized: Only the original issuer can revoke");

        cred.status = Status.REVOKED;

        emit CredentialRevoked(_credentialHash, msg.sender, block.timestamp);
    }

    function verifyCredential(bytes32 _credentialHash) external view returns (bool isValid, address issuer, uint256 issuedAt) {
        Credential memory cred = credentials[_credentialHash];
        isValid = cred.status == Status.VALID;
        issuer = cred.issuer;
        issuedAt = cred.issuedAt;
        return (isValid, issuer, issuedAt);
    }
}
