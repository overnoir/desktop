<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import { Toaster as Sonner } from "vue-sonner";

const props = withDefaults(defineProps<ToasterProps>(), {
  closeButton: true,
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
    }"
    v-bind="props"
    :toast-options="{
      classes: {
        closeButton: 'border-border! text-foreground! hover:bg-background!',
      },
    }"
  >
    <template #success-icon>
      <Icon name="lucide:circle-check" class="size-3" />
    </template>
    <template #info-icon>
      <Icon name="lucide:info" class="size-3" />
    </template>
    <template #warning-icon>
      <Icon name="lucide:triangle-alert" class="size-3" />
    </template>
    <template #error-icon>
      <Icon name="lucide:octagon-x" class="size-3" />
    </template>
    <template #loading-icon>
      <Icon name="lucide:loader-circle" class="size-3 animate-spin" />
    </template>
    <template #close-icon>
      <Icon name="lucide:x" class="size-3" />
    </template>
  </Sonner>
</template>
