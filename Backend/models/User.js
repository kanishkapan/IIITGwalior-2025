import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // ... existing fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'doctor', 'admin'], required: true },
  
  // Add encryption keys
  publicKey: { type: String }, // ECC public key for encryption
  encryptedPrivateKey: { type: String }, // Encrypted private key (encrypted with user password)
  
  // ... rest of existing fields
  availableSlots: [{
    dateTime: Date,
    isBooked: { type: Boolean, default: false }
  }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);