<script setup lang="ts">
definePageMeta({
  layout: "overlay",
});

const { filtredChannels, channels } = storeToRefs(useKickStore());
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const discordStore = useDiscordStore();
const { filtredUsers, guild, settings, connectedUser } =
  storeToRefs(discordStore);
const isDragging = useState("is-dragging", () => false);
const { general } = storeToRefs(useSettingsStore());
const { pageStyles, boxStyles } = useUi();
const { fetchKickLivestreams } = useApi();
const errorsStore = useErrorsStore();
const isOnline = useOnline();
const dragButton = ref();
const offsetX = ref(0);
const offsetY = ref(0);

await tauriEventListen<DiscordGuild | null>("guild-update", ({ payload }) => {
  guild.value = payload || undefined;
});

try {
  if (connectedUser.value) {
    connectedUser.value =
      await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");
  }
} catch (error) {
  errorsStore.addError(JSON.stringify(error), Source.Discord);
  connectedUser.value = null;
}

try {
  if (channels.value.length) {
    const { data } = await fetchKickLivestreams(
      channels.value.map(({ id }) => id),
    );
    if (data.value) {
      for (const channel of channels.value) {
        const match = data.value.find((s) => s.slug === channel.slug);
        channel.livestream = match ?? undefined;
      }
    }
  }
} catch (error) {
  errorsStore.addError(JSON.stringify(error), Source.Kick);
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

useEventListener(dragButton, "mousedown", async (e) => {
  if (e.button !== 0) {
    return;
  }

  e.preventDefault();

  const pos = await overlayWebviewWindow.outerPosition();

  offsetX.value = e.screenX - pos.x;
  offsetY.value = e.screenY - pos.y;
  isDragging.value = true;
});

useEventListener(window, "mousemove", async (e) => {
  if (!isDragging.value) {
    return;
  }

  overlayWebviewWindow.setPosition(
    new TauriDpiLogicalPosition(
      e.screenX - offsetX.value,
      e.screenY - offsetY.value,
    ),
  );
});

useEventListener(window, "mouseup", async () => {
  isDragging.value = false;
});
</script>

<template>
  <section class="flex" :style="pageStyles">
    <template v-if="isOnline">
      <DiscordGuild
        v-if="guild && settings.showGuild"
        :guild="{
          channel: {
            name: guild.channel.name,
          },
          iconUrl: guild.iconUrl,
          name: guild.name,
        }"
      />
      <DiscordUser v-for="user in filtredUsers" :key="user.id" :user />
      <KickChannel
        v-for="channel in filtredChannels"
        :key="channel.slug"
        :channel
      />
    </template>
    <Button
      v-else
      :style="boxStyles"
      class="bg-red-500! border-red-600"
      variant="outline"
      size="icon"
    >
      <Icon name="lucide:wifi-off" class="size-1/2" />
    </Button>
    <Button
      v-if="general.showSettings"
      :style="boxStyles"
      class="bg-background!"
      variant="outline"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="general.showDrag"
      ref="dragButton"
      class="bg-background!"
      :style="boxStyles"
      variant="outline"
      size="icon"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
