<script setup lang="ts">
defineProps<{
  channel: Omit<DiscordChannel, "users" | "id" | "guildId">;
}>();

const { overlayStyles } = useUi();
</script>

<template>
  <div class="relative">
    <NuxtImg
      v-if="channel.guildIconUrl"
      class="border"
      :src="channel.guildIconUrl"
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
      {{ channel.guildName }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        fontSize: overlayStyles.nameFontSize,
        maxWidth: overlayStyles.size,
      }"
    >
      {{ channel.name }}
    </div>
  </div>
</template>
