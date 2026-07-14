export default function () {
  const { streamers, settings } = storeToRefs(useKickStore());
  const { logError } = useLogs();

  function getStreamers({ slugs }: { slugs: string[] }) {
    return tauriCoreInvoke<KickStreamer[]>("get_kick_streamers", {
      slugs,
    });
  }

  const { resume: startPooling } = useIntervalFn(
    async () => {
      try {
        if (streamers.value.length) {
          const data = await getStreamers({
            slugs: streamers.value.map(({ slug }) => slug),
          });
          streamers.value = data;
        }
      } catch (error) {
        await logError({ error, source: LogSource.Kick });
        streamers.value = [];
      }
    },
    300000,
    { immediate: false, immediateCallback: true },
  );

  const filteredStreamers = computed(() => {
    let items = [...streamers.value];

    if (settings.value.showOnlyLive) {
      items = items.filter(({ stream }) => stream.isLive);
    }

    items.sort((a, b) => {
      const aLive = !!a.stream.isLive;
      const bLive = !!b.stream.isLive;

      if (aLive !== bLive) {
        return Number(bLive) - Number(aLive);
      }

      return a.name.localeCompare(b.name);
    });

    items = items.slice(0, settings.value.streamerLimit);

    return items;
  });

  return { startPooling, getStreamers, filteredStreamers };
}
