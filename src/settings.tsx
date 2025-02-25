import { Button, FormRow, TextInput } from "@vendetta/ui/components";
import { useState } from "react";
import { storage } from "@vendetta/plugin";
import { encryptToken } from "./encryption"; // Assume encryptToken is implemented in the encryption file

const SettingsPage = () => {
  const [accountName, setAccountName] = useState("");
  const [accountToken, setAccountToken] = useState("");

  const handleAddAccount = () => {
    if (accountName && accountToken) {
      // Encrypt the token before storing it in the plugin storage
      const encryptedToken = encryptToken(accountToken);

      // Save to storage
      storage.accounts = {
        ...storage.accounts,
        [accountName]: encryptedToken,
      };

      alert(`Account "${accountName}" added successfully!`);

      // Clear input fields
      setAccountName("");
      setAccountToken("");
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <div>
      <h2>Manage Accounts</h2>
      
      <FormRow label="Account Name">
        <TextInput
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter Account Name"
        />
      </FormRow>
      
      <FormRow label="Account Token">
        <TextInput
          value={accountToken}
          onChange={(e) => setAccountToken(e.target.value)}
          placeholder="Enter Account Token"
        />
      </FormRow>

      <Button
        text="Add Account"
        onPress={handleAddAccount}
      />
    </div>
  );
};

export default SettingsPage;
