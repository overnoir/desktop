<script setup lang="ts">
defineProps<{ memory: SystemMemory }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:memory-stick" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemLabel position="top">
      {{ memory.usedGb.toFixed(0) }}/{{ memory.totalGb.toFixed(0) }}GB
    </OverlayItemLabel>
    <OverlayItemLabel position="bottom">
      {{ memory.usagePercent.toFixed(1) }}%
    </OverlayItemLabel>
  </OverlayItem>
</template>
