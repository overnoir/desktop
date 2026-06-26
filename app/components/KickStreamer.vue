<script setup lang="ts">
defineProps<{
  streamer: KickStreamer;
  stream?: KickStream;
}>();

const { boxStyles, nameStyles, liveStyles } = useUi();
</script>

<template>
  <div
    :class="{
      'grayscale-100': !stream,
    }"
    class="relative"
  >
    <NuxtImg
      :src="streamer.profilePicture"
      class="border bg-secondary"
      alt="Profile Picture"
      :style="boxStyles"
    />
    <div
      v-if="stream"
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit truncate"
      :style="nameStyles"
    >
      {{ stream.category }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-flex items-center w-fit truncate"
      :style="nameStyles"
    >
      <span
        v-if="stream"
        class="bg-green-600 rounded-full shrink-0"
        :style="liveStyles"
      />
      <span class="truncate">{{ streamer.slug }}</span>
    </div>
  </div>
</template>
