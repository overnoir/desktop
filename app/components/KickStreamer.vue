<script setup lang="ts">
const { streamer } = defineProps<{
  streamer: KickStreamer;
}>();

const { boxStyles, nameStyles, liveStyles } = useUi();
const { settings } = storeToRefs(useKickStore());

const showCategory = computed(() => {
  if (settings.value.showCategory === KickShow.WhileLive)
    return streamer.channel.stream.isLive;
  if (settings.value.showCategory === KickShow.Never) return false;
  return true;
});

const showDisplayName = computed(() => {
  if (settings.value.showDisplayName === KickShow.WhileLive)
    return streamer.channel.stream.isLive;
  if (settings.value.showDisplayName === KickShow.Never) return false;
  return true;
});

const displayName = computed(() =>
  settings.value.displayName === KickDisplayName.Name
    ? streamer.user.name
    : streamer.channel.slug,
);
</script>

<template>
  <div
    :class="{
      'grayscale-100': !streamer.channel.stream.isLive,
    }"
    class="relative"
  >
    <NuxtImg
      :src="streamer.user.profilePicture"
      class="border bg-secondary"
      alt="Profile Picture"
      :style="boxStyles"
    />
    <div
      v-if="streamer.channel.stream.isLive && showCategory"
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit truncate"
      :style="nameStyles"
    >
      {{ streamer.channel.category.name }}
    </div>
    <div
      v-if="showDisplayName"
      class="absolute bg-background/70 left-0 bottom-0 inline-flex items-center w-fit truncate"
      :style="nameStyles"
    >
      <span
        v-if="streamer.channel.stream.isLive"
        class="bg-green-600 rounded-full shrink-0"
        :style="liveStyles"
      />
      <span class="truncate">
        {{ displayName }}
      </span>
    </div>
  </div>
</template>
