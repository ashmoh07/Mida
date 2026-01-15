
/**
 * Utility for AES-GCM Encryption/Decryption using Web Crypto API.
 */

async function deriveKey(password: string, salt: Uint8Array) {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: Uint8Array, password: string): Promise<Uint8Array> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const result = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encryptedContent), salt.length + iv.length);
  return result;
}

export async function decryptData(data: Uint8Array, password: string): Promise<Uint8Array> {
  try {
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encryptedContent = data.slice(28);
    
    const key = await deriveKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedContent
    );
    
    return new Uint8Array(decrypted);
  } catch (err) {
    throw new Error("كلمة المرور غير صحيحة أو البيانات تالفة.");
  }
}

export function validatePassword(password: string): boolean {
  // الحد الأدنى 8 أحرف، حرف كبير، حرف صغير، ورقم
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return minLength && hasUpper && hasLower && hasNumber;
}
