import { storage } from "@vendetta/plugin";
import { registerSettings } from "@vendetta/settings";
import { Button, FormRow, TextInput } from "@vendetta/ui/components";
import { useState } from "react";
import { Clipboard } from "@vendetta/ui/native";
import { encryptToken, decryptToken, generateKey } from "./encryption";

// Default storage setup
storage.accounts = storage.accounts ?? {};
storage.encryptionKey = storage.encryptionKey ?? generateKey(); // Ensure key is stored

// Function to switch accounts
const switchAccount = async (accountId: string) => {
  if (!storage.accounts[accountId]) {
    alert("Account not found!");
    return;
  }

  // Decrypt the token
  const token = await decryptToken(storage.accounts[accountId], storage.encryptionKey);
  if (!token) {
    alert("Failed to decrypt the token.");
    return;
  }

  // Simulate login (replace this with actual login logic)
  loginWithToken(token);
};

// Simulated login function
const loginWithToken = async (token: string) => {
  Clipboard.setString(token);
  alert("Token copied to clipboard. Paste it in Discord's login page.");
};

// Function to add an account
const addAccount = async (accountId: string, token: string) => {
  const encryptedToken = await encryptToken(token, storage.encryptionKey);
  storage.accounts[accountId] = encryptedToken;
  alert(`Account ${accountId} added successfully!`);
};

// Settings UI
const SettingsPage = () => {
  const [accountId, setAccountId] = useState("");
  const [accountToken, setAccountToken] = useState("");

  const handleAddAccount = () => {
    if (accountId && accountToken) {
      addAccount(accountId, accountToken);
      setAccountId("");
      setAccountToken("");
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <>
      <FormRow label="Account ID">
        <TextInput value={accountId} onChangeText={setAccountId} placeholder="Enter Account ID" />
      </FormRow>
      <FormRow label="Account Token">
        <TextInput value={accountToken} onChangeText={setAccountToken} placeholder="Enter Account Token" />
      </FormRow>
      <Button text="Add Account" onPress={handleAddAccount} />
    </>
  );
};

// Register settings
export const onLoad = () => {
  registerSettings("account-switcher-settings", SettingsPage);
};

export const onUnload = () => {};
