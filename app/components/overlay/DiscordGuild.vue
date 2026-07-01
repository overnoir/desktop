<script setup lang="ts">
const props = defineProps<{
  guild: Pick<DiscordGuild, "iconUrl" | "name"> & {
    channel: Pick<DiscordChannel, "name">;
  };
}>();

const { settings } = storeToRefs(useDiscordStore());

const guildIconUrl = computed(() => {
  if (!props.guild.iconUrl) {
    return;
  }

  const url = new URL(props.guild.iconUrl);

  url.searchParams.set("size", "4096");
  url.searchParams.set(
    "animated",
    String(settings.value.showGuildIconAnimated),
  );

  return url.toString();
});
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent>
      <NuxtImg
        v-if="guild.iconUrl"
        :src="guildIconUrl"
        class="size-full"
        alt="Icon"
      />
      <div v-else class="size-full bg-[#5865F2]" />
    </OverlayBaseContent>
    <OverlayBaseLabel position="top">
      {{ guild.name }}
    </OverlayBaseLabel>
    <OverlayBaseLabel position="bottom">
      {{ guild.channel.name }}
    </OverlayBaseLabel>
  </OverlayBase>
</template>
