<script setup lang="ts">
defineProps<{ cpu: SystemCpu }>();
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent>
      <Icon name="lucide:cpu" class="size-[35%]" />
    </OverlayBaseContent>
    <OverlayBaseLabel position="top">
      {{ cpu.active }}/{{ cpu.total }}
    </OverlayBaseLabel>
    <OverlayBaseLabel position="bottom">
      {{ cpu.usagePercent.toFixed(1) }}%
    </OverlayBaseLabel>
  </OverlayBase>
</template>
