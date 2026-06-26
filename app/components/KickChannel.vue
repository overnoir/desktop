<script setup lang="ts">
const { channel } = defineProps<{
  channel: KickChannel;
}>();

const { boxStyles, nameStyles, liveStyles } = useUi();
const { settings } = storeToRefs(useKickStore());

const showCategory = computed(() => {
  if (settings.value.showCategory === KickShow.WhileLive)
    return !!channel.livestream;
  if (settings.value.showCategory === KickShow.Never) return false;
  return true;
});

const showSlug = computed(() => {
  if (settings.value.showSlug === KickShow.WhileLive)
    return !!channel.livestream;
  if (settings.value.showSlug === KickShow.Never) return false;
  return true;
});
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
      v-if="channel.livestream && showCategory"
      class="absolute bg-background/70 left-0 top-0 inline-block w-fit truncate"
      :style="nameStyles"
    >
      {{ channel.livestream.category }}
    </div>
    <div
      v-if="showSlug"
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
