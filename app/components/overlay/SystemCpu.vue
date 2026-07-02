<script setup lang="ts">
defineProps<{ cpu: SystemCpu }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:cpu" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemBadge position="top">
      {{ cpu.active }}/{{ cpu.total }}
    </OverlayItemBadge>
    <OverlayItemBadge position="bottom">
      {{ cpu.usagePercent.toFixed(1) }}%
    </OverlayItemBadge>
  </OverlayItem>
</template>
