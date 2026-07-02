<script setup lang="ts">
defineProps<{ battery: SystemBattery }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:battery-full" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemBadge position="bottom">
      {{ (battery.percent || 0).toFixed(0) }}%
    </OverlayItemBadge>
    <OverlayItemBadge v-if="battery.isCharging" position="top">
      <Icon name="lucide:zap" />
    </OverlayItemBadge>
  </OverlayItem>
</template>
