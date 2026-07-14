export default function () {
  async function logError({
    source,
    error,
  }: {
    source: LogSource;
    error: unknown;
  }) {
    return tauriLogError(`[${source}] ${getErrorMessage(error)}`);
  }

  async function get() {
    return tauriCoreInvoke<string[]>("get_logs");
  }

  async function clear() {
    return tauriCoreInvoke("clear_logs");
  }

  return { logError, get, clear };
}
