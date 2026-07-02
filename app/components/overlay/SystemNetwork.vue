<script setup lang="ts">
defineProps<{ network: SystemNetwork }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:wifi" class="size-[35%]" />
    </OverlayItemContent>
    <OverlayItemBadge position="top">
      {{ network.upload.toFixed(2) }}MB
    </OverlayItemBadge>
    <OverlayItemBadge position="bottom">
      {{ network.download.toFixed(2) }}MB
    </OverlayItemBadge>
  </OverlayItem>
</template>
