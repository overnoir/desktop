<script setup lang="ts">
defineProps<{ cpu: SystemCpu }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:cpu" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemLabel position="top">
      {{ cpu.active }}/{{ cpu.total }}
    </OverlayItemLabel>
    <OverlayItemLabel position="bottom">
      {{ cpu.usagePercent.toFixed(1) }}%
    </OverlayItemLabel>
  </OverlayItem>
</template>
