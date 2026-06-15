<script setup lang="ts">
const props = defineProps<{
  guild: Pick<DiscordGuild, "iconUrl" | "name"> & {
    channel: Pick<DiscordGuild["channel"], "name">;
  };
}>();

const { settings } = storeToRefs(useDiscordStore());
const { boxStyles, nameStyles } = useUi();

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
      :style="boxStyles"
      :src="guildIconUrl"
      alt="Guild Icon"
      class="border"
    />
    <div v-else :style="boxStyles" class="border bg-[#5865F2]" />
    <div
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit px-[4%] truncate"
      :style="nameStyles"
    >
      {{ guild.name }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="nameStyles"
    >
      {{ guild.channel.name }}
    </div>
  </div>
</template>
