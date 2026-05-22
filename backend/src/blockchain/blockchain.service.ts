import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    // We would inject these from a config module in a real app
    this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Default hardhat account 0 private key
    this.wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', this.provider);
    
    // ABI for CredentialRegistry (simplified for mock implementation)
    const abi = [
      "function issueCredential(bytes32 _credentialHash) external",
      "function revokeCredential(bytes32 _credentialHash) external",
      "function verifyCredential(bytes32 _credentialHash) external view returns (bool isValid, address issuer, uint256 issuedAt)"
    ];
    
    // We'd use an env variable for deployed contract address
    this.contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', abi, this.wallet);
  }

  async anchorCredential(hash: string): Promise<string> {
    try {
      const tx = await this.contract.issueCredential(hash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to anchor credential:', error);
      throw error;
    }
  }

  async revokeCredential(hash: string): Promise<string> {
    const tx = await this.contract.revokeCredential(hash);
    const receipt = await tx.wait();
    return receipt.hash;
  }
}
