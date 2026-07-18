<script setup lang="ts">
import type { CSSProperties } from "vue";

const { percent, critical, warning } = defineProps<{
  percent: number;
  critical: {
    max: number;
    min: number;
  };
  warning: {
    max: number;
    min: number;
  };
}>();

const { general } = storeToRefs(useSettingsStore());

const strokeDashoffset = computed(
  () => circumference.value - (percent / 100) * circumference.value,
);
const radius = computed(() => (size.value - strokeWidth.value) / 2);
const size = computed(() => Math.round(general.value.size / 1.15));
const circumference = computed(() => 2 * Math.PI * radius.value);
const strokeWidth = computed(() => size.value / 15);
const center = computed(() => size.value / 2);

const color = computed(() => {
  if (percent >= critical.min && percent < critical.max) {
    return "var(--color-red-500)";
  }
  if (percent >= warning.min && percent < warning.max) {
    return "var(--color-yellow-500)";
  }
  return "var(--color-green-500)";
});

const styles = computed<CSSProperties>(() => ({
  fontSize: `${Math.round(size.value / 4.5)}px`,
  height: `${size.value}px`,
  width: `${size.value}px`,
  color: color.value,
}));
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="styles">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :stroke-width="strokeWidth"
        stroke="var(--secondary)"
        fill="transparent"
        :cx="center"
        :cy="center"
        :r="radius"
      />
      <circle
        :style="{
          transition: 'stroke-dashoffset 0.3s ease-in-out',
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
        }"
        :stroke-dashoffset="strokeDashoffset"
        :stroke-dasharray="circumference"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        fill="transparent"
        :stroke="color"
        :cx="center"
        :cy="center"
        :r="radius"
      />
    </svg>
    <div
      class="absolute left-1/2 top-1/2 -translate-1/2 grid place-items-center leading-tight"
    >
      <slot />
    </div>
  </div>
</template>
