<script setup lang="ts">
import type { CSSProperties } from "vue";

const { general } = storeToRefs(useSettingsStore());

const styles = computed<CSSProperties>(() => ({
  borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
  height: `${general.value.size}px`,
  width: `${general.value.size}px`,
}));
</script>

<template>
  <div
    class="relative bg-background grid place-items-center border overflow-hidden"
    :style="styles"
  >
    <slot />
  </div>
</template>
