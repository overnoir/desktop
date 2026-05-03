<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-vue-next";
import { Toaster as Sonner } from "vue-sonner";
import type { Theme } from "vue-sonner/src/packages/types.js";

const props = withDefaults(defineProps<ToasterProps>(), {
  closeButton: true,
});
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    v-bind="props"
    :theme="$colorMode.preference as Theme"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-3" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-3" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-3" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-3" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-3 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-3" />
    </template>
  </Sonner>
</template>
