<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  type SelectScrollUpButtonProps,
  SelectScrollUpButton,
  useForwardProps,
} from "reka-ui";

const props = defineProps<
  SelectScrollUpButtonProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    data-slot="select-scroll-up-button"
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <Icon name="lucide:chevron-up" class="size-4" />
    </slot>
  </SelectScrollUpButton>
</template>
