import { create } from 'ipfs-http-client';
import encryptionService from './encryptionService.js';

class IPFSService {
  constructor() {
    // Connect to IPFS node (you can use Infura or local node)
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(
          `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
        ).toString('base64')}`
      }
    });
  }

  // Store encrypted health record on IPFS
  async storeHealthRecord(healthRecordData, recipientPublicKey) {
    try {
      // Encrypt the data before storing
      const encryptedPackage = encryptionService.encryptData(
        healthRecordData, 
        recipientPublicKey
      );

      // Convert to buffer and add to IPFS
      const buffer = Buffer.from(JSON.stringify(encryptedPackage));
      const result = await this.ipfs.add(buffer);
      
      return {
        ipfsHash: result.path,
        encryptionInfo: {
          ephemeralPublicKey: encryptedPackage.ephemeralPublicKey,
          iv: encryptedPackage.iv,
          authTag: encryptedPackage.authTag
        }
      };
    } catch (error) {
      console.error('IPFS storage failed:', error);
      throw error;
    }
  }

  // Retrieve and decrypt health record from IPFS
  async retrieveHealthRecord(ipfsHash, privateKey) {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      const encryptedPackage = JSON.parse(Buffer.concat(chunks).toString());
      const decryptedData = encryptionService.decryptData(encryptedPackage, privateKey);
      
      return decryptedData;
    } catch (error) {
      console.error('IPFS retrieval failed:', error);
      throw error;
    }
  }
}

export default new IPFSService();