<script setup lang="ts">
defineProps<{ memory: SystemMemory }>();

const { boxStyles, nameStyles } = useStyles();
</script>

<template>
  <div class="relative">
    <div
      class="relative bg-background grid place-items-center border overflow-hidden"
      :style="boxStyles"
    >
      <Icon name="lucide:memory-stick" class="size-[35%]" />
    </div>
    <div
      class="absolute bg-background border left-0 top-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ memory.usedGb.toFixed(0) }}/{{ memory.totalGb.toFixed(0) }}GB
    </div>
    <div
      class="absolute bg-background border left-0 bottom-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ memory.usagePercent.toFixed(1) }}%
    </div>
  </div>
</template>
