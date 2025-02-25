export const generateKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

export const encryptToken = async (token: string, key: CryptoKey): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  const encryptedToken = new Uint8Array(iv.length + encrypted.byteLength);
  encryptedToken.set(iv, 0);
  encryptedToken.set(new Uint8Array(encrypted), iv.length);

  return encryptedToken;
};

export const decryptToken = async (encryptedToken: Uint8Array, key: CryptoKey): Promise<string | null> => {
  try {
    const iv = encryptedToken.slice(0, 12);
    const encryptedData = encryptedToken.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
