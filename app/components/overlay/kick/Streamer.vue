<script setup lang="ts">
const { streamer } = defineProps<{
  streamer: KickStreamer;
}>();

const { settings } = storeToRefs(useKickStore());

const showCategory = computed(
  () =>
    settings.value.showCategory !== KickShow.Never &&
    (settings.value.showCategory !== KickShow.WhileLive ||
      streamer.stream.isLive),
);

const showDisplayName = computed(
  () =>
    settings.value.showDisplayName !== KickShow.Never &&
    (settings.value.showDisplayName !== KickShow.WhileLive ||
      streamer.stream.isLive),
);

const displayName = computed(() =>
  settings.value.displayName === KickDisplayName.Name
    ? streamer.name
    : streamer.slug,
);
</script>

<template>
  <OverlayItem
    :class="{
      'grayscale-100': !streamer.stream.isLive,
    }"
  >
    <OverlayItemContent>
      <NuxtImg
        :src="streamer.profilePicture"
        alt="Profile Picture"
        class="size-full"
      />
    </OverlayItemContent>
    <OverlayItemBadge
      v-if="streamer.stream.isLive && showCategory"
      position="top"
    >
      {{ streamer.stream.category }}
    </OverlayItemBadge>
    <OverlayItemBadge v-if="showDisplayName" position="bottom">
      {{ displayName }}
    </OverlayItemBadge>
  </OverlayItem>
</template>
