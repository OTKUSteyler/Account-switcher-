// account-switcher.ts
import { storage } from "@vendetta/plugin";
import { registerSettings } from "@vendetta/settings";
import SettingsPage from "./settings";
import { Clipboard } from "@vendetta/ui/native";
import { encryptToken, decryptToken } from "./encryption";

// Default storage setup
storage.accounts = storage.accounts ?? {};

// Function to switch accounts
const switchAccount = (accountId: string) => {
  if (!storage.accounts[accountId]) return;

  // Decrypt the token for the account
  const token = decryptToken(storage.accounts[accountId]);
  
  if (!token) {
    console.error("Failed to decrypt token for account:", accountId);
    return;
  }

  // Use the token to log the user in
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
  // Simulate a login process (this will depend on your plugin's capabilities)
  // For now, we will assume you are directly copying the token to the clipboard
  Clipboard.setString(token);
};

// Function to add account with token (for adding accounts to local storage)
const addAccount = (accountId: string, token: string) => {
  encryptToken(token).then((encryptedToken) => {
    storage.accounts[accountId] = encryptedToken;
    alert(`Account ${accountId} added successfully!`);
  }).catch(() => {
    alert("Failed to encrypt the token.");
  });
};

// Register settings page for adding accounts
export const onLoad = () => {
  registerSettings("account-switcher-settings", SettingsPage);
};

export const onUnload = () => {};
