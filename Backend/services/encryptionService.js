import CryptoJS from 'crypto-js';
import EC from 'elliptic';
import crypto from 'crypto';

const ec = new EC.ec('secp256k1');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
  }

  // Generate ECC key pair for user
  generateKeyPair() {
    const keyPair = ec.genKeyPair();
    return {
      privateKey: keyPair.getPrivate('hex'),
      publicKey: keyPair.getPublic('hex')
    };
  }

  // Hybrid encryption: AES for data + ECC for key exchange
  encryptData(data, recipientPublicKey) {
    // Generate random AES key
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt data with AES
    const cipher = crypto.createCipher(this.algorithm, aesKey);
    cipher.setAAD(Buffer.from('healthcare-data'));
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();

    // Encrypt AES key with recipient's public key (ECC)
    const recipientKey = ec.keyFromPublic(recipientPublicKey, 'hex');
    const ephemeralKeyPair = ec.genKeyPair();
    const sharedSecret = ephemeralKeyPair.derive(recipientKey.getPublic());
    
    const encryptedAESKey = CryptoJS.AES.encrypt(
      aesKey.toString('hex'), 
      sharedSecret.toString(16)
    ).toString();

    return {
      encryptedData: encrypted,
      encryptedKey: encryptedAESKey,
      ephemeralPublicKey: ephemeralKeyPair.getPublic('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Decrypt data
  decryptData(encryptedPackage, privateKey) {
    const userKeyPair = ec.keyFromPrivate(privateKey, 'hex');
    const ephemeralPublicKey = ec.keyFromPublic(encryptedPackage.ephemeralPublicKey, 'hex');
    const sharedSecret = userKeyPair.derive(ephemeralPublicKey.getPublic());

    // Decrypt AES key
    const decryptedAESKey = CryptoJS.AES.decrypt(
      encryptedPackage.encryptedKey,
      sharedSecret.toString(16)
    ).toString(CryptoJS.enc.Utf8);

    // Decrypt data with AES key
    const decipher = crypto.createDecipher(this.algorithm, Buffer.from(decryptedAESKey, 'hex'));
    decipher.setAuthTag(Buffer.from(encryptedPackage.authTag, 'hex'));
    decipher.setAAD(Buffer.from('healthcare-data'));

    let decrypted = decipher.update(encryptedPackage.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  // Generate hash for blockchain integrity
  generateHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }
}

export default new EncryptionService();