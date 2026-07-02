<script setup lang="ts">
defineProps<{ memory: SystemMemory }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:memory-stick" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemBadge position="top">
      {{ memory.usedGb.toFixed(0) }}/{{ memory.totalGb.toFixed(0) }}GB
    </OverlayItemBadge>
    <OverlayItemBadge position="bottom">
      {{ memory.usagePercent.toFixed(1) }}%
    </OverlayItemBadge>
  </OverlayItem>
</template>
