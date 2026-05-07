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
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
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
