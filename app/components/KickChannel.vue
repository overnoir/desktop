<script setup lang="ts">
defineProps<{
  channel: KickChannel;
}>();

const { boxStyles, nameStyles, liveStyles } = useUi();
</script>

<template>
  <div
    :class="{
      'grayscale-100': !channel.livestream,
    }"
    class="relative"
  >
    <NuxtImg
      :src="channel.profilePicture"
      class="border bg-secondary"
      alt="Profile Picture"
      :style="boxStyles"
    />
    <div
      v-if="channel.livestream"
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit truncate"
      :style="nameStyles"
    >
      {{ channel.livestream.category }}
    </div>
    <div
      class="absolute bg-background/70 left-0 bottom-0 inline-flex items-center w-fit truncate"
      :style="nameStyles"
    >
      <span
        v-if="channel.livestream"
        class="bg-green-600 rounded-full shrink-0"
        :style="liveStyles"
      />
      <span class="truncate">{{ channel.slug }}</span>
    </div>
  </div>
</template>
