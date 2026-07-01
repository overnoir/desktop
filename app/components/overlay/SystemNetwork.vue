<script setup lang="ts">
defineProps<{ network: SystemNetwork }>();
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent>
      <Icon name="lucide:wifi" class="size-[35%]" />
    </OverlayBaseContent>
    <OverlayBaseLabel position="top">
      {{ network.upload.toFixed(2) }}MB
    </OverlayBaseLabel>
    <OverlayBaseLabel position="bottom">
      {{ network.download.toFixed(2) }}MB
    </OverlayBaseLabel>
  </OverlayBase>
</template>
