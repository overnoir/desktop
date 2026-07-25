export default function () {
  function logError({ source, error }: { source: LogSource; error: unknown }) {
    return tauriLogError(`[${source}] ${getErrorMessage(error)}`);
  }

  function get() {
    return tauriCoreInvoke<string[]>("get_logs");
  }

  function clear() {
    return tauriCoreInvoke("clear_logs");
  }

  async function open() {
    const dir = await tauriPathAppLogDir();
    await tauriOpenerOpenPath(dir);
  }

  return { logError, get, clear, open };
}
