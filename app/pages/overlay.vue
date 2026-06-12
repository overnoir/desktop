<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const { general } = storeToRefs(useSettingsStore());
const discordStore = useDiscordStore();
const { users, channel } = storeToRefs(discordStore);
const { overlayStyles } = useUi();

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
    :class="{
      'flex-col': general.orientation === Orientation.Vertical,
    }"
    :style="{
      gap: overlayStyles.gap,
    }"
    class="flex"
  >
    <DiscordChannel
      v-if="channel"
      :channel="{
        guildIconUrl: channel.guildIconUrl,
        guildName: channel.guildName,
        name: channel.name,
      }"
    />
    <DiscordUser v-for="user in users" :key="user.id" :user />
    <Button
      v-if="general.showSettings"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="general.isDraggable"
      data-tauri-drag-region
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
