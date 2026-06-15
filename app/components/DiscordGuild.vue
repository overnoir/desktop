<script setup lang="ts">
const props = defineProps<{
  guild: Pick<DiscordGuild, "iconUrl" | "name"> & {
    channel: Pick<DiscordGuild["channel"], "name">;
  };
}>();

const { settings } = storeToRefs(useDiscordStore());
const { overlayStyles } = useUi();

const guildIconUrl = computed(() => {
  if (!props.guild.iconUrl) return undefined;
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
  <div class="relative">
    <NuxtImg
      v-if="guild.iconUrl"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      :src="guildIconUrl"
      alt="Guild Icon"
      class="border"
    />
    <div
      v-else
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      class="border bg-[#5865F2]"
    />
    <div
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit px-[4%] truncate"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        fontSize: overlayStyles.nameFontSize,
        maxWidth: overlayStyles.size,
      }"
    >
      {{ guild.name }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        fontSize: overlayStyles.nameFontSize,
        maxWidth: overlayStyles.size,
      }"
    >
      {{ guild.channel.name }}
    </div>
  </div>
</template>
