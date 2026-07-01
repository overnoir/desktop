<script setup lang="ts">
defineProps<{ battery: SystemBattery }>();
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent>
      <Icon name="lucide:battery-full" class="size-[35%]" />
    </OverlayBaseContent>
    <OverlayBaseLabel position="bottom">
      {{ (battery.percent || 0).toFixed(0) }}%
    </OverlayBaseLabel>
    <OverlayBaseIcons
      v-if="battery.isCharging"
      :icons="[{ name: 'lucide:zap' }]"
    />
  </OverlayBase>
</template>
