export default function () {
  const { settings } = storeToRefs(useSystemStore());
  const { logError } = useLogs();
  const system = shallowRef<{
    battery: SystemBattery | null;
    network: SystemNetwork | null;
    memory: SystemMemory | null;
    cpu: SystemCpu | null;
  } | null>(null);

  const { resume: startPooling } = useIntervalFn(
    async () => {
      const { showNetwork, showBattery, showMemory, showCpu } = settings.value;

      if (!showNetwork && !showBattery && !showMemory && !showCpu) {
        system.value = null;
        return;
      }

      try {
        const { battery, cpu, memory, network } = await tauriCoreInvoke<{
          network: SystemNetwork | null;
          battery: SystemBattery | null;
          memory: SystemMemory | null;
          cpu: SystemCpu | null;
        }>("get_system", {
          network: showNetwork,
          battery: showBattery,
          memory: showMemory,
          cpu: showCpu,
        });

        system.value = {
          network,
          battery,
          memory,
          cpu,
        };
      } catch (error) {
        await logError({ source: LogSource.System, error });
        system.value = null;
      }
    },
    1000,
    { immediate: false, immediateCallback: true },
  );

  return { startPooling, system };
}
