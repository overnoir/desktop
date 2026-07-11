export default function () {
  function getStreamers({ slugs }: { slugs: string[] }) {
    return tauriCoreInvoke<KickStreamer[]>("get_kick_streamers", {
      slugs,
    });
  }

  return { getStreamers };
}
