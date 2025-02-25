import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { encryptToken } from "./encryption";
import { showToast } from "@vendetta/ui/toasts";

const { FormSection, FormRow, FormInput, FormButton } = Forms;
const { useState } = General.React;

export default function SettingsPage() {
  useProxy(storage);

  const [newAccountName, setNewAccountName] = useState("");
  const [newToken, setNewToken] = useState("");

  const addAccount = () => {
    if (!newAccountName || !newToken) return;

    storage.accounts[newAccountName] = encryptToken(newToken);
    showToast(`Added account: ${newAccountName}`);
    setNewAccountName("");
    setNewToken("");
  };

  return (
    <FormSection title="Account Switcher">
      {Object.keys(storage.accounts).map((account) => (
        <FormRow
          label={account}
          subLabel="Tap to copy token"
          onPress={() => Clipboard.setString(storage.accounts[account])}
        />
      ))}

      <FormInput
        placeholder="Account Name"
        value={newAccountName}
        onChangeText={setNewAccountName}
      />
      <FormInput
        placeholder="Discord Token"
        value={newToken}
        onChangeText={setNewToken}
      />

      <FormButton text="Add Account" onPress={addAccount} />
    </FormSection>
  );
}
