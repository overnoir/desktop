<script setup lang="ts">
defineProps<{
  description: string;
  title: string;
}>();
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <h1 class="text-sm">
        {{ title }}
      </h1>
      <p class="text-secondary-foreground text-xs">
        {{ description }}
      </p>
    </div>
    <div class="justify-self-end shrink-0">
      <slot />
    </div>
  </div>
</template>
