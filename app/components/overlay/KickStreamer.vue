<script setup lang="ts">
const { streamer } = defineProps<{
  streamer: KickStreamer;
}>();

const { settings } = storeToRefs(useKickStore());

const showCategory = computed(
  () =>
    settings.value.showCategory !== KickShow.Never &&
    (settings.value.showCategory !== KickShow.WhileLive ||
      streamer.channel.stream.isLive),
);

const showDisplayName = computed(
  () =>
    settings.value.showDisplayName !== KickShow.Never &&
    (settings.value.showDisplayName !== KickShow.WhileLive ||
      streamer.channel.stream.isLive),
);

const displayName = computed(() =>
  settings.value.displayName === KickDisplayName.Name
    ? streamer.user.name
    : streamer.channel.slug,
);
</script>

<template>
  <OverlayItem
    :class="{
      'grayscale-100': !streamer.channel.stream.isLive,
    }"
  >
    <OverlayItemContent>
      <NuxtImg
        :src="streamer.user.profilePicture"
        alt="Profile Picture"
        class="size-full"
      />
    </OverlayItemContent>
    <OverlayItemLabel
      v-if="streamer.channel.stream.isLive && showCategory"
      position="top"
    >
      {{ streamer.channel.category.name }}
    </OverlayItemLabel>
    <OverlayItemLabel v-if="showDisplayName" position="bottom">
      {{ displayName }}
    </OverlayItemLabel>
  </OverlayItem>
</template>
