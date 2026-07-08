<script setup lang="ts">
import type { CSSProperties } from "vue";

const { position } = defineProps<{ position: "top" | "bottom" }>();

const { general } = storeToRefs(useSettingsStore());

const styles = computed<CSSProperties>(() => ({
  borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
  paddingInline: `${Math.round(general.value.size / 40)}px`,
  fontSize: `${Math.round(general.value.size / 5.5)}px`,
  height: `${Math.round(general.value.size / 4)}px`,
  gap: `${Math.round(general.value.size / 40)}px`,
  [position === "top" ? "top" : "bottom"]: "0",
  maxWidth: `${general.value.size}px`,
}));
</script>

<template>
  <div
    class="flex items-center absolute bg-background border left-0 text-nowrap overflow-hidden leading-tight z-10 *:shrink-0"
    :style="styles"
  >
    <slot />
  </div>
</template>
