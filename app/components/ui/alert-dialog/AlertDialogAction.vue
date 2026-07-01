<script setup lang="ts">
import { buttonVariants, type ButtonVariants } from "@/components/ui/button";
import { AlertDialogAction, type AlertDialogActionProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  AlertDialogActionProps & {
    variant?: ButtonVariants["variant"];
    class?: HTMLAttributes["class"];
  }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="cn(buttonVariants({ variant }), props.class)"
  >
    <slot />
  </AlertDialogAction>
</template>
