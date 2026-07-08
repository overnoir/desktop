<script setup lang="ts">
defineProps<{ network: SystemNetwork }>();
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <Icon name="lucide:wifi" class="size-[33%]" />
    </OverlayItemContent>
    <OverlayItemBadge position="top">
      <Icon name="lucide:arrow-up" />
      <span> {{ network.upload.toFixed(1) }}MB </span>
    </OverlayItemBadge>
    <OverlayItemBadge position="bottom">
      <Icon name="lucide:arrow-down" />
      <span> {{ network.download.toFixed(1) }}MB </span>
    </OverlayItemBadge>
  </OverlayItem>
</template>
