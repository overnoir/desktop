<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import { Toaster as Sonner } from "vue-sonner";

const props = withDefaults(defineProps<ToasterProps>(), {
  closeButton: true,
  richColors: true,
});
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-text': 'var(--foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--normal-bg': 'var(--background)',
      '--success-bg': 'var(--color-green-400)',
      '--success-border': 'var(--color-green-500)',
      '--success-text': 'var(--color-green-950)',
      '--error-bg': 'var(--color-red-400)',
      '--error-border': 'var(--color-red-500)',
      '--error-text': 'var(--color-red-950)',
    }"
    v-bind="props"
    :toast-options="{
      classes: {
        closeButton:
          'hover:border-border! hover:text-foreground! hover:bg-background!',
      },
    }"
  >
    <template #success-icon>
      <Icon name="lucide:circle-check" class="size-4" />
    </template>
    <template #info-icon>
      <Icon name="lucide:info" class="size-4" />
    </template>
    <template #warning-icon>
      <Icon name="lucide:triangle-alert" class="size-4" />
    </template>
    <template #error-icon>
      <Icon name="lucide:triangle-alert" class="size-4" />
    </template>
    <template #loading-icon>
      <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
    </template>
    <template #close-icon>
      <Icon name="lucide:x" class="size-3" />
    </template>
  </Sonner>
</template>
