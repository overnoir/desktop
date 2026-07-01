<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { badgeVariants, type BadgeVariants } from ".";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  PrimitiveProps & {
    variant?: BadgeVariants["variant"];
    class?: HTMLAttributes["class"];
  }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ variant }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
