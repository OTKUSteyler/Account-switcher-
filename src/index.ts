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

  // Decrypt and copy token to clipboard
  const token = decryptToken(storage.accounts[accountId]);
  Clipboard.setString(token);

  console.log(`[AccountSwitcher] Copied token for ${accountId}`);

  // Show a toast message (optional)
  alert(`Token for ${accountId} copied! Logout and paste the new token.`);
};

// Register settings page
export const onLoad = () => {
  registerSettings("account-switcher-settings", SettingsPage);
};

export const onUnload = () => {};
