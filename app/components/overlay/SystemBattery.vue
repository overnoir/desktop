<script setup lang="ts">
defineProps<{ battery: SystemBattery }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:battery-full" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemLabel position="bottom">
      {{ (battery.percent || 0).toFixed(0) }}%
    </OverlayItemLabel>
    <OverlayItemIcons
      v-if="battery.isCharging"
      :icons="[{ name: 'lucide:zap' }]"
    />
  </OverlayItem>
</template>
