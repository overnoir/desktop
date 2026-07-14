export default function () {
  async function getMetadata() {
    return tauriCoreInvoke<VaultItemMetadata[]>("get_vault_metadata");
  }

  async function clear() {
    return tauriCoreInvoke("clear_vault");
  }

  return { getMetadata, clear };
}
