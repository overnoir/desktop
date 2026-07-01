<script setup lang="ts">
import {
  type AlertDialogEmits,
  type AlertDialogProps,
  useForwardPropsEmits,
  AlertDialogRoot,
} from "reka-ui";

const props = defineProps<AlertDialogProps>();
const emits = defineEmits<AlertDialogEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <AlertDialogRoot
    v-slot="slotProps"
    data-slot="alert-dialog"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </AlertDialogRoot>
</template>
