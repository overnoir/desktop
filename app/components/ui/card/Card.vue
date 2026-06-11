<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-background text-foreground flex flex-col gap-6 rounded-lg border py-6',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
