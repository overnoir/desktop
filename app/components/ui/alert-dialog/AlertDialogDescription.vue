<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  type AlertDialogDescriptionProps,
  AlertDialogDescription,
} from "reka-ui";

const props = defineProps<
  AlertDialogDescriptionProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <AlertDialogDescription
    data-slot="alert-dialog-description"
    v-bind="delegatedProps"
    :class="cn('text-secondary-foreground text-sm', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
