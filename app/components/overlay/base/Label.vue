<script setup lang="ts">
import type { CSSProperties } from "vue";

defineProps<{ position: "top" | "bottom" }>();

const { general } = storeToRefs(useSettingsStore());

const styles = computed<CSSProperties>(() => ({
  borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
  paddingInline: `${Math.round(general.value.size / 22)}px`,
  fontSize: `${Math.round(general.value.size / 5.5)}px`,
  maxWidth: `${general.value.size}px`,
}));
</script>

<template>
  <div
    class="absolute bg-background border left-0 text-nowrap overflow-hidden leading-tight z-10"
    :class="position === 'top' ? 'top-0' : 'bottom-0'"
    :style="styles"
  >
    <slot />
  </div>
</template>
