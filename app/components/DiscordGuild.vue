<script setup lang="ts">
defineProps<{
  guild: Pick<DiscordGuild, "iconUrl" | "name"> & {
    channel: Pick<DiscordGuild["channel"], "name">;
  };
}>();

const { overlayStyles } = useUi();
</script>

<template>
  <div class="relative">
    <NuxtImg
      v-if="guild.iconUrl"
      class="border"
      :src="guild.iconUrl"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      alt="Guild Icon"
    />
    <div
      v-else
      class="border bg-[#5865F2]"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
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
