<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const { create } = useTray();

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2 + 3,
);

await overlayWebviewWindow.setPosition(
  new TauriDpiLogicalPosition(settings.value.x, settings.value.y),
);
await create();

if (tauriOSType() === "macos") {
  await tauriCoreInvoke("init_macos");
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
});
</script>

<template>
  <Html
    :style="{
      'border-radius': `${radius}px`,
      opacity: `${settings.opacity}%`,
    }"
  >
    <Body
      class="size-max overflow-hidden **:transition-none"
      :class="{
        'bg-transparent!': !settings.showBackground,
      }"
    >
      <main
        :class="{
          'ring ring-border ring-inset': settings.showBackground,
          'p-0.5': settings.showBackground,
        }"
        :style="{ 'border-radius': `${radius}px` }"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
