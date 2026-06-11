<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const discordStore = useDiscordStore();
const { connectedUser, channel } = storeToRefs(discordStore);
const { advanced } = storeToRefs(useSettingsStore());
const { overlayStyles } = useUi();
const { create } = useTray();

if (advanced.value.autoStart !== (await tauriAutoStartIsEnabled())) {
  if (advanced.value.autoStart) {
    await tauriAutoStartEnable();
  } else {
    await tauriAutoStartDisable();
  }
}

await overlayWebviewWindow.setPosition(
  new TauriDpiLogicalPosition(advanced.value.x, advanced.value.y),
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
    advanced.value.x = x;
    advanced.value.y = y;
  });
} else {
  await overlayWebviewWindow.onMoved(({ payload }) => {
    const { x, y } = payload;
    advanced.value.x = x;
    advanced.value.y = y;
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

  if (advanced.value.orientation === Orientation.Vertical) {
    if (advanced.value.alignment === "center") {
      newY = currentPosition.y - deltaY / 2;
    } else if (advanced.value.alignment === "right") {
      newY = currentPosition.y - deltaY;
    }
  } else {
    if (advanced.value.alignment === "center") {
      newX = currentPosition.x - deltaX / 2;
    } else if (advanced.value.alignment === "right") {
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
    <Body class="size-max **:select-none **:transition-none">
      <main
        :class="{
          'bg-background border border-border': advanced.showBackground,
        }"
        :style="
          advanced.showBackground
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
