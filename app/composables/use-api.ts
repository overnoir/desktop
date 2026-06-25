export const useApiFetch = createUseFetch({
  baseURL: useRuntimeConfig().public.apiUrl,
});

export default function () {
  async function fetchKickStreamers(slug: string[]) {
    return useApiFetch<KickStreamer[]>("/kick/streamers", {
      query: {
        slug,
      },
    });
  }

  return { fetchKickStreamers };
}
