<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { appSettings } = storeToRefs(useAppSettingsStore());
const discordStateStore = useDiscordStateStore();
const { discordState } = storeToRefs(discordStateStore);
const { create } = useTray();

const backgroundStyle = computed(() =>
  appSettings.value.showBackground
    ? {
        borderRadius: `${(appSettings.value.size * appSettings.value.radius) / 200 + appSettings.value.size / 25}px`,
        padding: `${appSettings.value.size / 25}px`,
      }
    : undefined,
);

await overlayWebviewWindow.setPosition(
  new TauriDpiLogicalPosition(appSettings.value.x, appSettings.value.y),
);
await create();

if (tauriOSType() === "macos") {
  await tauriCoreInvoke("init_nspanel");
  await tauriCoreInvoke("set_nspanel_ignore_cursor", {
    value: appSettings.value.ignoreCursor,
  });
}

if (appSettings.value.autoStart !== (await tauriAutoStartIsEnabled())) {
  if (appSettings.value.autoStart) {
    await tauriAutoStartEnable();
  } else {
    await tauriAutoStartDisable();
  }
}

useResizeObserver(document.body, async (entries) => {
  const rect = entries[0]?.contentRect;
  if (rect) {
    await overlayWebviewWindow.setSize(
      new TauriDpiLogicalSize(rect.width, rect.height),
    );
  }
});

onMounted(async () => {
  const updaterWebviewWindow = (
    await tauriWebviewWindowGetAllWebviewWindows()
  ).find(({ label }) => label === WebviewWindow.Updater);

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
  }

  if (discordState.value.connected) {
    try {
      await tauriCoreInvoke(`connect_discord`);
    } catch (error) {
      discordStateStore.addError(JSON.stringify(error));
      discordState.value.connected = false;
    }
  }
});
</script>

<template>
  <Html
    :style="{
      opacity: `${appSettings.opacity}%`,
    }"
  >
    <Body class="size-max **:select-none **:transition-none">
      <main
        :class="{
          'bg-background border': appSettings.showBackground,
        }"
        :style="backgroundStyle"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
