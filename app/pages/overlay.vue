<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { discordSettings } = storeToRefs(useDiscordSettingsStore());
const { appSettings } = storeToRefs(useAppSettingsStore());
const discordStateStore = useDiscordStateStore();
const voiceState = ref<VoiceChannelState>();
const isMacos = tauriOSType() === "macos";

const filtredUsers = computed(() => {
  const state = voiceState.value;
  if (!state) return [];
  let users = state.users;
  if (!discordSettings.value.showMe && state.currentUserId) {
    users = users.filter((u) => u.userId !== state.currentUserId);
  }
  if (discordSettings.value.showOnlySpeakers) {
    users = users.filter((u) => u.isSpeaking);
  }
  return users;
});

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

tauriEventListen<VoiceChannelState>("voice-state", (event) => {
  voiceState.value = event.payload;
});

tauriEventListen<string>("voice-error", (event) => {
  discordStateStore.addError(event.payload);
});
</script>

<template>
  <section
    class="flex"
    :class="{
      'flex-col': appSettings.orientation === Orientation.Vertical,
    }"
    :style="{
      gap: `${(appSettings.size * appSettings.gap) / 100}px`,
    }"
  >
    <DiscordUser v-for="user in filtredUsers" :key="user.userId" :user />
    <Button
      v-if="appSettings.showSettings"
      :style="{
        borderRadius: `${(appSettings.size * appSettings.radius) / 200}px`,
        height: `${appSettings.size}px`,
        width: `${appSettings.size}px`,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="appSettings.isDraggable"
      data-tauri-drag-region
      :style="{
        borderRadius: `${(appSettings.size * appSettings.radius) / 200}px`,
        height: `${appSettings.size}px`,
        width: `${appSettings.size}px`,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @mouseup="isMacos && updatePosition()"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
