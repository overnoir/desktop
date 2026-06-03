<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const isMacos = tauriOSType() === "macos";

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2,
);

if (!isMacos) {
  overlayWebviewWindow.onMoved(({ payload }) => {
    const { x, y } = payload;
    settings.value.x = x;
    settings.value.y = y;
  });
}

async function updatePosition() {
  const { x, y } = await overlayWebviewWindow.outerPosition();
  settings.value.x = x;
  settings.value.y = y;
}

async function openMainWebviewWindow() {
  const mainWebviewWindow = (
    await tauriWebviewWindowGetAllWebviewWindows()
  ).find(({ label }) => label === WebviewWindow.Main);

  if (mainWebviewWindow) {
    await mainWebviewWindow.show();
    await mainWebviewWindow.unminimize();
    await mainWebviewWindow.setFocus();
  } else {
    new TauriWebviewWindowWebviewWindow(
      WebviewWindow.Main,
      mainWebviewWindowOptions,
    );
  }
}
</script>

<template>
  <section
    class="flex items-center gap-0.5"
    :class="{
      'flex-row': settings.orientation === 'horizontal',
      'flex-col': settings.orientation === 'vertical',
    }"
  >
    <NuxtImg
      v-for="i in 3"
      :key="i"
      src="/logo.png"
      class="bg-black"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      alt="Avatar"
    />
    <Button
      v-if="settings.showSettings"
      :class="{
        'ring ring-inset ring-border': !settings.showBackground,
      }"
      class="bg-background! ring-0!"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-show="settings.isDraggable"
      data-tauri-drag-region
      :class="{
        'ring ring-inset ring-border': !settings.showBackground,
      }"
      class="bg-background! ring-0!"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @mouseup="isMacos && updatePosition()"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
