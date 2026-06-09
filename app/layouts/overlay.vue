<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const discordStore = useDiscordStore();
const { channel, connectedUser } = storeToRefs(discordStore);
const isDragging = useState("is-dragging", () => false);
const { settings } = storeToRefs(useSettingsStore());
const { create } = useTray();

const backgroundStyle = computed(() =>
  settings.value.showBackground
    ? {
        borderRadius: `${(settings.value.size * settings.value.radius) / 200 + settings.value.size / 25}px`,
        padding: `${settings.value.size / 25}px`,
      }
    : undefined,
);

await tauriEventListen<DiscordChannel | null>(
  "channel-update",
  ({ payload }) => {
    channel.value = payload || undefined;
  },
);

await tauriEventListen<string>("channel-error", ({ payload }) => {
  discordStore.addError(payload);
});

await overlayWebviewWindow.setPosition(
  new TauriDpiLogicalPosition(settings.value.x, settings.value.y),
);
await create();

if (tauriOSType() === "macos") {
  await tauriCoreInvoke("init_nspanel");
  await tauriCoreInvoke("set_nspanel_ignore_cursor", {
    value: settings.value.ignoreCursor,
  });
}

if (settings.value.autoStart !== (await tauriAutoStartIsEnabled())) {
  if (settings.value.autoStart) {
    await tauriAutoStartEnable();
  } else {
    await tauriAutoStartDisable();
  }
}

if (connectedUser.value) {
  try {
    connectedUser.value =
      await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");
  } catch (error) {
    discordStore.addError(JSON.stringify(error));
    connectedUser.value = null;
  }
}

useResizeObserver(document.body, async (entries) => {
  const entry = entries[0];

  if (!entry) {
    return;
  }

  const { width, height } = entry.contentRect;

  if (isDragging.value) {
    await overlayWebviewWindow.setSize(new TauriDpiLogicalSize(width, height));
    return;
  }

  const [currentPosition, currentSize] = await Promise.all([
    overlayWebviewWindow.outerPosition(),
    overlayWebviewWindow.outerSize(),
  ]);

  const deltaX = width - currentSize.width;
  const deltaY = height - currentSize.height;

  let newX = currentPosition.x;
  let newY = currentPosition.y;

  if (settings.value.orientation === Orientation.Vertical) {
    if (settings.value.alignment === "center") {
      newY = currentPosition.y - deltaY / 2;
    } else if (settings.value.alignment === "right") {
      newY = currentPosition.y - deltaY;
    }
  } else {
    if (settings.value.alignment === "center") {
      newX = currentPosition.x - deltaX / 2;
    } else if (settings.value.alignment === "right") {
      newX = currentPosition.x - deltaX;
    }
  }

  await Promise.all([
    overlayWebviewWindow.setPosition(new TauriDpiLogicalPosition(newX, newY)),
    overlayWebviewWindow.setSize(new TauriDpiLogicalSize(width, height)),
  ]);
});

onMounted(async () => {
  const updaterWebviewWindow = (
    await tauriWebviewWindowGetAllWebviewWindows()
  ).find(({ label }) => label === WebviewWindow.Updater);

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
  }
});
</script>

<template>
  <Html
    :style="{
      opacity: `${settings.opacity}%`,
    }"
  >
    <Body class="size-max **:select-none **:transition-none">
      <main
        :class="{
          'bg-background border': settings.showBackground,
        }"
        :style="backgroundStyle"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
