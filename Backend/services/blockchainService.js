import BigchainDB from 'bigchaindb-driver';
import encryptionService from './encryptionService.js';

class BlockchainService {
  constructor() {
    // Configure BigchainDB connection
    this.conn = new BigchainDB.Connection('https://test.bigchaindb.com/api/v1/');
    this.adminKeyPair = new BigchainDB.Ed25519Keypair();
  }

  // Create asset on blockchain for audit trail
  async createHealthRecordAsset(healthRecordData, userPublicKey) {
    try {
      // Generate hash of the original data for integrity
      const dataHash = encryptionService.generateHash(healthRecordData);
      
      // Create asset metadata (non-sensitive info for audit)
      const asset = {
        data: {
          type: 'health_record',
          recordId: healthRecordData._id,
          patientId: healthRecordData.studentId,
          doctorId: healthRecordData.doctorId,
          timestamp: new Date().toISOString(),
          dataHash: dataHash
        }
      };

      // Create metadata for the transaction
      const metadata = {
        action: 'create_health_record',
        authorizedUsers: [userPublicKey],
        accessLevel: 'patient_doctor_admin',
        createdAt: new Date().toISOString()
      };

      // Create and sign transaction
      const txCreateAlice = BigchainDB.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [BigchainDB.Transaction.makeOutput(
          BigchainDB.Transaction.makeEd25519Condition(this.adminKeyPair.publicKey)
        )],
        this.adminKeyPair.publicKey
      );

      const txCreateAliceSigned = BigchainDB.Transaction.signTransaction(
        txCreateAlice,
        this.adminKeyPair.privateKey
      );

      // Send to BigchainDB
      const retrievedTx = await this.conn.postTransactionCommit(txCreateAliceSigned);
      
      return {
        transactionId: retrievedTx.id,
        assetId: retrievedTx.id,
        dataHash: dataHash
      };
    } catch (error) {
      console.error('Blockchain transaction failed:', error);
      throw error;
    }
  }

  // Log access to health records
  async logAccess(recordId, accessorId, action) {
    try {
      const asset = {
        data: {
          type: 'access_log',
          recordId: recordId,
          accessorId: accessorId,
          action: action, // 'read', 'update', 'delete'
          timestamp: new Date().toISOString()
        }
      };

      const metadata = {
        auditTrail: true,
        immutable: true
      };

      const txCreateAlice = BigchainDB.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [BigchainDB.Transaction.makeOutput(
          BigchainDB.Transaction.makeEd25519Condition(this.adminKeyPair.publicKey)
        )],
        this.adminKeyPair.publicKey
      );

      const txCreateAliceSigned = BigchainDB.Transaction.signTransaction(
        txCreateAlice,
        this.adminKeyPair.privateKey
      );

      await this.conn.postTransactionCommit(txCreateAliceSigned);
      return true;
    } catch (error) {
      console.error('Access logging failed:', error);
      return false;
    }
  }

  // Verify data integrity
  async verifyIntegrity(recordId, currentData) {
    try {
      const assets = await this.conn.searchAssets(`"recordId": "${recordId}"`);
      if (assets.length === 0) return false;

      const originalHash = assets[0].data.dataHash;
      const currentHash = encryptionService.generateHash(currentData);
      
      return originalHash === currentHash;
    } catch (error) {
      console.error('Integrity verification failed:', error);
      return false;
    }
  }
}

export default new BlockchainService();