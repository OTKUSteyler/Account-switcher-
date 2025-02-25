// settings.tsx
import { useState } from "react";
import { Button, FormRow, TextInput } from "@vendetta/ui/components";
import { addAccount } from "./account-switcher"; // Function from account-switcher.ts

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

export default SettingsPage;
