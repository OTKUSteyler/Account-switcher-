import { storage } from "@vendetta/plugin";
import { registerSettings } from "@vendetta/settings";
import { Button, FormRow, TextInput } from "@vendetta/ui/components";
import { useState } from "react";
import { Clipboard } from "@vendetta/ui/native";

// Default storage setup
storage.accounts = storage.accounts ?? {};

// Encryption/Decryption Logic
const encryptToken = async (token: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token); // Convert token to bytes

  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Combine IV and encrypted data for storage
  const encryptedToken = new Uint8Array(iv.length + encrypted.byteLength);
  encryptedToken.set(iv, 0);
  encryptedToken.set(new Uint8Array(encrypted), iv.length);
  return encryptedToken;
};

const decryptToken = async (encryptedToken: Uint8Array): Promise<string | null> => {
  const iv = encryptedToken.slice(0, 12); // Extract IV
  const encryptedData = encryptedToken.slice(12); // Extract encrypted data

  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Function to switch accounts
const switchAccount = (accountId: string) => {
  if (!storage.accounts[accountId]) return;

  // Decrypt the token for the account
  const token = decryptToken(storage.accounts[accountId]);

  if (!token) {
    console.error("Failed to decrypt token for account:", accountId);
    return;
  }

  // Use the token to log the user in (simulated login)
  loginWithToken(token).then(() => {
    console.log(`[AccountSwitcher] Switched to account ${accountId} and logged in!`);
  }).catch((error) => {
    console.error(`[AccountSwitcher] Error logging in with token for ${accountId}:`, error);
  });

  // Optionally, show a toast message or notification
  alert(`Switched to ${accountId}. You are now logged in.`);
};

// Function to login with a given token (simulated login)
const loginWithToken = async (token: string) => {
  // Simulate a login process (for now, just copying the token to the clipboard)
  Clipboard.setString(token);
};

// Function to add account with token
const addAccount = (accountId: string, token: string) => {
  encryptToken(token).then((encryptedToken) => {
    storage.accounts[accountId] = encryptedToken;
    alert(`Account ${accountId} added successfully!`);
  }).catch(() => {
    alert("Failed to encrypt the token.");
  });
};

// Settings page UI component
const SettingsPage = () => {
  const [accountId, setAccountId] = useState("");
  const [accountToken, setAccountToken] = useState("");

  const handleAddAccount = () => {
    if (accountId && accountToken) {
      addAccount(accountId, accountToken);
      setAccountId(""); // Clear the input field
      setAccountToken(""); // Clear the input field
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <div>
      <h2>Add Account</h2>
      <FormRow label="Account ID">
        <TextInput
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter Account ID"
        />
      </FormRow>
      <FormRow label="Account Token">
        <TextInput
          value={accountToken}
          onChange={(e) => setAccountToken(e.target.value)}
          placeholder="Enter Account Token"
        />
      </FormRow>
      <Button text="Add Account" onPress={handleAddAccount} />
    </div>
  );
};

// Register the settings page
export const onLoad = () => {
  registerSettings("account-switcher-settings", SettingsPage);
};

export const onUnload = () => {};
