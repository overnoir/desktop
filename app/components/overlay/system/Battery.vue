<script setup lang="ts">
defineProps<{ battery: SystemBattery }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <OverlaySystemProgress
        :percent="battery.percent || 0"
        :critical="{ min: 0, max: 14 }"
        :warning="{ min: 15, max: 29 }"
        :normal="{ min: 30, max: 100 }"
      >
        {{ (battery.percent || 0).toFixed(1) }}%
      </OverlaySystemProgress>
    </OverlayItemContent>
    <OverlayItemBadge position="bottom">
      <Icon name="lucide:battery-full" />
      <Icon v-if="battery.isCharging" name="lucide:plug" />
    </OverlayItemBadge>
  </OverlayItem>
</template>
