<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const discordStore = useDiscordStore();
const { connectedUser, channel } = storeToRefs(discordStore);
const { general, advanced } = storeToRefs(useSettingsStore());
const { overlayStyles } = useUi();
const { create } = useTray();

if (advanced.value.autoStart !== (await tauriAutoStartIsEnabled())) {
  if (advanced.value.autoStart) {
    await tauriAutoStartEnable();
  } else {
    await tauriAutoStartDisable();
  }
}

if (
  advanced.value.alwaysOnTop !== (await overlayWebviewWindow.isAlwaysOnTop())
) {
  await overlayWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
}

await overlayWebviewWindow.setPosition(
  new TauriDpiLogicalPosition(general.value.x, general.value.y),
);

await tauriEventListen<string>("channel-error", ({ payload }) => {
  discordStore.addError(payload);
});

await tauriEventListen<DiscordChannel | null>(
  "channel-update",
  ({ payload }) => {
    channel.value = payload || undefined;
  },
);

if (tauriOSType() === "macos") {
  await tauriCoreInvoke("init_nspanel");
  await tauriCoreInvoke("set_nspanel_ignore_cursor", {
    value: advanced.value.ignoreCursor,
  });
  await tauriEventListen("nspanel-moved", async () => {
    const { x, y } = await overlayWebviewWindow.outerPosition();
    general.value.x = x;
    general.value.y = y;
  });
} else {
  await overlayWebviewWindow.onMoved(({ payload }) => {
    const { x, y } = payload;
    general.value.x = x;
    general.value.y = y;
  });
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

  const [currentPosition, currentSize] = await Promise.all([
    overlayWebviewWindow.outerPosition(),
    overlayWebviewWindow.outerSize(),
  ]);

  const deltaX = width - currentSize.width;
  const deltaY = height - currentSize.height;

  let newX = currentPosition.x;
  let newY = currentPosition.y;

  if (general.value.orientation === Orientation.Vertical) {
    if (general.value.alignment === "center") {
      newY = currentPosition.y - deltaY / 2;
    } else if (general.value.alignment === "right") {
      newY = currentPosition.y - deltaY;
    }
  } else {
    if (general.value.alignment === "center") {
      newX = currentPosition.x - deltaX / 2;
    } else if (general.value.alignment === "right") {
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

  await create();
});
</script>

<template>
  <Html
    :style="{
      opacity: overlayStyles.opacity,
    }"
  >
    <Body class="size-max **:select-none **:transition-none bg-transparent">
      <main
        :class="{
          'bg-background border': general.showBackground,
        }"
        :style="
          general.showBackground
            ? {
                borderRadius: overlayStyles.backgroundBorderRadius,
                padding: overlayStyles.backgroundPadding,
              }
            : undefined
        "
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
