import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  // ... existing fields
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Traditional fields (for backward compatibility)
  diagnosis: String,
  treatment: String,
  prescription: String,
  
  // Blockchain integration fields
  ipfsHash: { type: String }, // Hash of encrypted data on IPFS
  blockchainTxId: { type: String }, // BigchainDB transaction ID
  dataHash: { type: String }, // SHA256 hash for integrity verification
  isEncrypted: { type: Boolean, default: false },
  
  // Access control
  authorizedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
}, { timestamps: true });

export default mongoose.model('HealthRecord', healthRecordSchema);