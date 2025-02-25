import { storage } from "@vendetta/plugin";
import { registerSettings } from "@vendetta/settings";
import SettingsPage from "./settings"; // Your Settings Page Component
import { Clipboard } from "@vendetta/ui/native";
import { encryptToken, decryptToken } from "./encryption"; // Your encryption/decryption utilities

// Default storage setup: Make sure accounts are stored in an object format
storage.accounts = storage.accounts ?? {};

// Function to switch accounts (decrypt and copy token)
const switchAccount = (accountId: string) => {
  if (!storage.accounts[accountId]) {
    console.error(`[AccountSwitcher] Account ${accountId} does not exist in storage.`);
    return;
  }

  // Decrypt the token before copying to clipboard
  const encryptedToken = storage.accounts[accountId];
  const decryptedToken = decryptToken(encryptedToken);

  if (!decryptedToken) {
    console.error(`[AccountSwitcher] Failed to decrypt token for account ${accountId}`);
    return;
  }

  // Copy the decrypted token to clipboard
  Clipboard.setString(decryptedToken);

  console.log(`[AccountSwitcher] Copied token for ${accountId}`);

  // Optionally, show a toast or alert
  alert(`Token for ${accountId} copied! Please log out and paste the new token.`);
};

// Register the settings page to allow users to configure the plugin
export const onLoad = () => {
  // Registers the settings page for managing accounts
  registerSettings("account-switcher-settings", SettingsPage);
};

export const onUnload = () => {
  // Cleanup if needed when the plugin is unloaded (empty for now)
};
