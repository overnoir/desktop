<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const isDragging = useState("is-dragging", () => false);
const { users } = storeToRefs(useDiscordStore());
const { settings } = storeToRefs(useSettingsStore());
const isMacos = tauriOSType() === "macos";

if (!isMacos) {
  overlayWebviewWindow.onMoved(({ payload }) => {
    const { x, y } = payload;
    settings.value.x = x;
    settings.value.y = y;
  });
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

async function updatePosition() {
  const { x, y } = await overlayWebviewWindow.outerPosition();
  settings.value.x = x;
  settings.value.y = y;
}
</script>

<template>
  <section
    class="flex"
    :class="{
      'flex-col': settings.orientation === Orientation.Vertical,
    }"
    :style="{
      gap: `${(settings.size * settings.gap) / 100}px`,
    }"
  >
    <DiscordUser v-for="user in users" :key="user.id" :user />
    <Button
      v-if="settings.showSettings"
      :style="{
        borderRadius: `${(settings.size * settings.radius) / 200}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="settings.isDraggable"
      data-tauri-drag-region
      :style="{
        borderRadius: `${(settings.size * settings.radius) / 200}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @mouseup="
        async () => {
          if (isMacos) {
            await updatePosition();
            isDragging = false;
          }
        }
      "
      @mousedown="isDragging = true"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
