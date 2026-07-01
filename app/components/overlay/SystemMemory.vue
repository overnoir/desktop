<script setup lang="ts">
defineProps<{ memory: SystemMemory }>();
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent>
      <Icon name="lucide:memory-stick" class="size-[35%]" />
    </OverlayBaseContent>
    <OverlayBaseLabel position="top">
      {{ memory.usedGb.toFixed(0) }}/{{ memory.totalGb.toFixed(0) }}GB
    </OverlayBaseLabel>
    <OverlayBaseLabel position="bottom">
      {{ memory.usagePercent.toFixed(1) }}%
    </OverlayBaseLabel>
  </OverlayBase>
</template>
