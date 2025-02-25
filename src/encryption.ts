import { AES, enc } from "crypto-js";

// Encryption key (Can be stored securely)
const SECRET_KEY = "YOUR_SECRET_KEY_HERE";

// Encrypt function
export const encryptToken = (token: string) => {
  return AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt function
export const decryptToken = (encryptedToken: string) => {
  return AES.decrypt(encryptedToken, SECRET_KEY).toString(enc.Utf8);
};
