<script setup lang="ts">
defineProps<{ network: SystemNetwork }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:wifi" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemLabel position="top">
      {{ network.upload.toFixed(2) }}MB
    </OverlayItemLabel>
    <OverlayItemLabel position="bottom">
      {{ network.download.toFixed(2) }}MB
    </OverlayItemLabel>
  </OverlayItem>
</template>
