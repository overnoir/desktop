export default function () {
  const { create, getByLabel } = useWebviewWindow();

  async function open(stream: Stream) {
    const streamWebviewWindow = await getByLabel({
      label: WebviewWindowLabel.Stream,
    });

    if (streamWebviewWindow) {
      await streamWebviewWindow.emitTo(
        WebviewWindowLabel.Stream,
        "stream-update",
        stream,
      );

      return;
    }

    const overlayWebviewWindow = await getByLabel({
      label: WebviewWindowLabel.Overlay,
    });

    if (!overlayWebviewWindow) {
      return;
    }

    await create({
      ...streamWebviewWindowOptions,
      url: `/stream?${new URLSearchParams(stream)}`,
      label: WebviewWindowLabel.Stream,
    });
  }

  async function listenEvents() {
    const loading = shallowRef(false);
    const router = useRouter();

    const stream = computed<Stream>(
      () => router.currentRoute.value.query as Stream,
    );

    await tauriEventListen<Stream>("stream-update", async ({ payload }) => {
      loading.value = true;
      await router.replace({ query: payload });
    });

    return { stream, loading };
  }

  return { open, listenEvents };
}
