export default function () {
  function get({
    network,
    battery,
    memory,
    cpu,
  }: {
    network: boolean;
    battery: boolean;
    memory: boolean;
    cpu: boolean;
  }) {
    return tauriCoreInvoke<{
      network: SystemNetwork | null;
      battery: SystemBattery | null;
      memory: SystemMemory | null;
      cpu: SystemCpu | null;
    }>("get_system", {
      network,
      battery,
      memory,
      cpu,
    });
  }

  return { get };
}
