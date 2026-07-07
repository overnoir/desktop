<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  SwitchRoot,
} from "reka-ui";

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    v-bind="forwarded"
    :class="
      cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary focus-visible:border-primary focus-visible:ring-primary/50 inline-flex h-5 w-8 shrink-0 items-center rounded-sm border transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'bg-background pointer-events-none block size-4 rounded-sm ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-3.5px)] data-[state=unchecked]:translate-x-[1.5px]',
        )
      "
    >
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
