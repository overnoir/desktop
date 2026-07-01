<script setup lang="ts">
defineProps<{ cpu: SystemCpu }>();

const { boxStyles, nameStyles } = useStyles();
</script>

<template>
  <div class="relative">
    <div
      class="relative bg-background grid place-items-center border overflow-hidden"
      :style="boxStyles"
    >
      <Icon name="lucide:cpu" class="size-[35%]" />
    </div>
    <div
      class="absolute bg-background border left-0 top-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ cpu.active }}/{{ cpu.total }}
    </div>
    <div
      class="absolute bg-background border left-0 bottom-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ cpu.usagePercent.toFixed(1) }}%
    </div>
  </div>
</template>
