<script setup lang="ts">
import { NumberFieldInput } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <NumberFieldInput
    data-slot="input"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-border bg-transparent py-1 text-sm text-center transition-colors placeholder:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
