<script setup lang="ts">
defineProps<{ memory: SystemMemory }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <OverlaySystemProgress
        :percent="memory.usagePercent"
        :critical="{ min: 90, max: 100 }"
        :warning="{ min: 75, max: 89 }"
      >
        {{ memory.usagePercent.toFixed(1) }}%
      </OverlaySystemProgress>
    </OverlayItemContent>
    <OverlayItemBadge position="bottom">
      <Icon name="lucide:microchip" />
      {{ memory.usedGb.toFixed(0) }}/{{ memory.totalGb.toFixed(0) }}
    </OverlayItemBadge>
  </OverlayItem>
</template>
