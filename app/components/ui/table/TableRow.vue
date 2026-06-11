<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tr
    data-slot="table-row"
    :class="
      cn(
        'hover:bg-secondary/50 data-[state=selected]:bg-secondary border-b transition-colors',
        props.class,
      )
    "
  >
    <slot />
  </tr>
</template>
