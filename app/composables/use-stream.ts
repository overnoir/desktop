export default function () {
  const { general } = storeToRefs(useSettingsStore());
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

    const position = await overlayWebviewWindow.outerPosition();
    const size = await overlayWebviewWindow.outerSize();
    const monitor = await tauriWindowCurrentMonitor();

    const { x, y } = generateOverlaySidePosition({
      size: {
        height: streamWebviewWindowOptions.height!,
        width: streamWebviewWindowOptions.width!,
      },
      orientation: general.value.orientation,
      overlay: { position, size },
      monitor,
    });

    await create({
      ...streamWebviewWindowOptions,
      url: `/stream?${new URLSearchParams(stream)}`,
      label: WebviewWindowLabel.Stream,
      x,
      y,
    });
  }

  async function listen() {
    const loading = ref(false);
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

  return { open, listen };
}
