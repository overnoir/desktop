<script setup lang="ts">
import { emptyMediaVariants, type EmptyMediaVariants } from ".";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  variant?: EmptyMediaVariants["variant"];
}>();
</script>

<template>
  <div
    data-slot="empty-icon"
    :data-variant="variant"
    :class="cn(emptyMediaVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
