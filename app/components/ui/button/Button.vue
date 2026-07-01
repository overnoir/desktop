<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { buttonVariants, type ButtonVariants } from ".";
import type { HTMLAttributes } from "vue";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="loading || disabled"
  >
    <Spinner v-if="loading" />
    <slot v-else />
  </Primitive>
</template>
