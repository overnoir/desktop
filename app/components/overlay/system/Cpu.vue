<script setup lang="ts">
defineProps<{ cpu: SystemCpu }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <OverlaySystemProgress
        :percent="cpu.usagePercent"
        :critical="{ min: 90, max: 100 }"
        :warning="{ min: 75, max: 89 }"
        :normal="{ min: 0, max: 74 }"
      >
        {{ cpu.usagePercent.toFixed(1) }}%
      </OverlaySystemProgress>
    </OverlayItemContent>
    <OverlayItemBadge position="bottom">
      <Icon name="lucide:cpu" />
      {{ cpu.active }}/{{ cpu.total }}
    </OverlayItemBadge>
  </OverlayItem>
</template>
