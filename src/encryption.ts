// encryption.ts
// Encrypts and decrypts account tokens securely

// Encrypts a token using AES-GCM
export const encryptToken = (token: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token); // Convert token to bytes

  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  ).then(key => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
    return window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    ).then(encrypted => {
      // Combine IV and encrypted data for storage
      const encryptedToken = new Uint8Array(iv.length + encrypted.byteLength);
      encryptedToken.set(iv, 0);
      encryptedToken.set(new Uint8Array(encrypted), iv.length);
      return encryptedToken;
    });
  });
};

// Decrypts a token using AES-GCM
export const decryptToken = (encryptedToken: Uint8Array): Promise<string | null> => {
  const iv = encryptedToken.slice(0, 12); // Extract IV
  const encryptedData = encryptedToken.slice(12); // Extract encrypted data

  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  ).then(key => {
    return window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData
    ).then(decrypted => {
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    }).catch(() => {
      console.error("Decryption failed");
      return null;
    });
  });
};
