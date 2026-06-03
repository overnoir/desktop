<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { appSettings } = storeToRefs(useAppSettingsStore());
const isMacos = tauriOSType() === "macos";

const radius = computed(
  () => (appSettings.value.size * appSettings.value.radius) / 100 / 2,
);

if (!isMacos) {
  overlayWebviewWindow.onMoved(({ payload }) => {
    const { x, y } = payload;
    appSettings.value.x = x;
    appSettings.value.y = y;
  });
}

async function updatePosition() {
  const { x, y } = await overlayWebviewWindow.outerPosition();
  appSettings.value.x = x;
  appSettings.value.y = y;
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
      'flex-row': appSettings.orientation === 'horizontal',
      'flex-col': appSettings.orientation === 'vertical',
    }"
  >
    <NuxtImg
      v-for="i in 3"
      :key="i"
      src="/logo.png"
      class="bg-black"
      :style="{
        'border-radius': `${radius}px`,
        height: `${appSettings.size}px`,
        width: `${appSettings.size}px`,
      }"
      alt="Avatar"
    />
    <Button
      v-if="appSettings.showSettings"
      :class="{
        'ring ring-inset ring-border': !appSettings.showBackground,
      }"
      class="bg-background! ring-0!"
      :style="{
        'border-radius': `${radius}px`,
        height: `${appSettings.size}px`,
        width: `${appSettings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="appSettings.isDraggable"
      data-tauri-drag-region
      :class="{
        'ring ring-inset ring-border': !appSettings.showBackground,
      }"
      class="bg-background! ring-0!"
      :style="{
        'border-radius': `${radius}px`,
        height: `${appSettings.size}px`,
        width: `${appSettings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @mouseup="isMacos && updatePosition()"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
