import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
  ) {}

  async issueCredential(data: any) {
    try {
      const institution = await this.prisma.institution.findFirst();
      
      // Upsert student based on the provided studentEmail
      const email = data.studentEmail?.toLowerCase() || 'unknown@example.com';
      const student = await this.prisma.student.upsert({
        where: { email },
        update: {},
        create: {
          name: data.recipientName || 'Unknown Student',
          email: email
        }
      });
      
      if (!institution) {
          throw new Error('No institution configured in DB.');
      }

      // Standardize metadata structure
      const metadataPayload = {
        credentialId: crypto.randomUUID(),
        issuer: institution.did,
        student: student?.email || 'unknown',
        credentialName: data.credentialTitle || 'Credential',
        issuedAt: new Date().toISOString(),
        status: 'ACTIVE',
        version: 'v1'
      };

      let pinataResponse;
      let attempt = 0;
      const maxAttempts = 2;
      let ipfsCid = '';

      while (attempt < maxAttempts) {
        try {
          pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: JSON.stringify({
              pinataContent: metadataPayload,
              pinataMetadata: { name: `CredChain-${metadataPayload.credentialId}` }
            }),
            signal: AbortSignal.timeout(5000) // 5s timeout
          });

          if (!pinataResponse.ok) {
            throw new Error(`Pinata HTTP error: ${pinataResponse.status}`);
          }

          const pinataData = await pinataResponse.json();
          ipfsCid = pinataData.IpfsHash;
          break; // Success, exit retry loop
        } catch (e) {
          attempt++;
          console.warn(`Pinata upload attempt ${attempt} failed: ${e.message}`);
          if (attempt >= maxAttempts) {
            throw new Error('Failed to upload to Pinata after multiple attempts');
          }
          await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
        }
      }

      const gatewayUrl = `${process.env.PINATA_GATEWAY}/ipfs/${ipfsCid}`;
      console.log(`[Storage] Credential pinned to IPFS: ${gatewayUrl}`);

      // 2. Generate Hash (Keccak256) or use Document Hash
      const credentialHash = data.documentHash || ethers.keccak256(ethers.toUtf8Bytes(ipfsCid));

      // 3. Anchor on Blockchain
      const txHash = await this.blockchain.anchorCredential(credentialHash);

      // 4. Save to Database
      const record = await this.prisma.credentialRecord.create({
        data: {
          institutionId: institution.id,
          studentId: student?.id,
          recipientName: data.recipientName || 'Unknown',
          credentialTitle: data.credentialTitle || 'Credential',
          ipfsCid,
          credentialHash,
          txHash,
          status: 'ISSUED',
        },
      });

      return record;
    } catch (error) {
      console.error(error);
      const errorMessage = String(error.message || error.reason || error.shortMessage || '');
      if (errorMessage.includes('already exists')) {
        throw new BadRequestException('This credential document has already been issued.');
      }
      throw new InternalServerErrorException('Failed to issue credential');
    }
  }

  async getWalletCredentials(user: any) {
    // Extract primary email address from Clerk user object
    const email = user?.email_addresses?.[0]?.email_address?.toLowerCase() || user?.email?.toLowerCase();
    
    if (!email) {
      return [];
    }

    return this.prisma.credentialRecord.findMany({
      where: { 
        student: { email } 
      },
      include: { institution: true },
      orderBy: { issueDate: 'desc' }
    });
  }

  async getInstitutionRecords() {
    return this.prisma.credentialRecord.findMany({
      include: { student: true, institution: true }
    });
  }

  async revokeCredential(hash: string) {
    // 1. Revoke on blockchain
    await this.blockchain.revokeCredential(hash);

    // 2. Update DB
    const record = await this.prisma.credentialRecord.update({
      where: { credentialHash: hash },
      data: { status: 'REVOKED' }
    });

    return record;
  }

  async verifyCredential(hash: string) {
    // Real verification:
    // 1. Fetch from DB (represents our off-chain index)
    const record = await this.prisma.credentialRecord.findUnique({
      where: { credentialHash: hash },
      include: { institution: true },
    });
    
    // 2. Check blockchain for source of truth (omitted pure contract call here, we trust the sync for now, but usually we'd do a contract view call)
    // For Sprint 4 we simulate the contract view call by returning the record status directly, since our DB is updated synchronously above.
    
    if (!record) return { isValid: false, status: 'INVALID' };
    
    // Log verification
    await this.prisma.verificationLog.create({
      data: {
        credentialHash: hash,
        verifiedBy: 'System',
        statusResult: record.status === 'ISSUED' ? 'VALID' : record.status
      }
    });

    return {
      isValid: record.status === 'ISSUED',
      status: record.status === 'ISSUED' ? 'VALID' : record.status,
      record,
    };
  }
}
