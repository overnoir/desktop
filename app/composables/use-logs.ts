export default function () {
  async function logError({
    source,
    error,
  }: {
    source: LogSource;
    error: unknown;
  }) {
    return tauriLogError(
      `[${source}] ${isObject(error) ? JSON.stringify(error) : String(error)}`,
    );
  }

  async function getLogs() {
    return tauriCoreInvoke<string[]>("get_logs");
  }

  return { logError, getLogs };
}
