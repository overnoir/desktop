<script setup lang="ts">
defineProps<{
  channel: Omit<DiscordChannel, "users" | "id" | "guildId">;
}>();

const { settings } = storeToRefs(useSettingsStore());

const boxStyle = computed(() => ({
  borderRadius: `${(settings.value.size * settings.value.radius) / 200}px`,
  height: `${settings.value.size}px`,
  width: `${settings.value.size}px`,
}));

const nameSize = computed(() => `${settings.value.size / 5.5}px`);
const nameMaxWidth = computed(() => `${settings.value.size}px`);
const radius = computed(
  () => `${(settings.value.size * settings.value.radius) / 200}px`,
);
</script>

<template>
  <div class="relative">
    <NuxtImg
      v-if="channel.guildIconUrl"
      class="size-full border border-input"
      :src="channel.guildIconUrl"
      :style="boxStyle"
      alt="Guild Icon"
    />
    <div
      v-else
      class="size-full border border-input bg-[#5865F2]"
      :style="boxStyle"
    />
    <div
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit px-[4%] truncate"
      :style="{
        maxWidth: nameMaxWidth,
        borderRadius: radius,
        fontSize: nameSize,
      }"
    >
      {{ channel.guildName }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        maxWidth: nameMaxWidth,
        borderRadius: radius,
        fontSize: nameSize,
      }"
    >
      {{ channel.name }}
    </div>
  </div>
</template>
