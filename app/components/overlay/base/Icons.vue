<script setup lang="ts">
import type { CSSProperties } from "vue";

defineProps<{
  icons: OverlayBaseIcon[];
}>();

const { general } = storeToRefs(useSettingsStore());

const iconsStyles = computed<CSSProperties>(() => ({
  borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
  padding: `${Math.round(general.value.size / 22)}px`,
  gap: `${Math.round(general.value.size / 22)}px`,
}));

const iconStyles = computed<CSSProperties>(() => ({
  height: `${Math.round(general.value.size / 5.5)}px`,
  width: `${Math.round(general.value.size / 5.5)}px`,
}));
</script>

<template>
  <div
    class="absolute bg-background border left-0 top-0 flex items-center z-10"
    :style="iconsStyles"
  >
    <Icon
      v-for="icon in icons"
      :key="icon.name"
      :class="{ 'text-destructive': icon.variant === 'destructive' }"
      :style="iconStyles"
      :name="icon.name"
    />
  </div>
</template>
