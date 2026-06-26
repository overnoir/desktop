export const useApiFetch = createUseFetch({
  baseURL: useRuntimeConfig().public.apiUrl,
});

export default function () {
  async function fetchKickChannels(slug: string[]) {
    return useApiFetch<KickChannelsResponse>("/kick/channels", {
      query: {
        slug,
      },
    });
  }

  async function fetchKickLivestreams(id: number[]) {
    return useApiFetch<KickLivestreamsResponse>("/kick/livestreams", {
      query: {
        id,
      },
    });
  }

  return { fetchKickChannels, fetchKickLivestreams };
}
