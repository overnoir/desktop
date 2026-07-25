<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <OverlayItem>
    <OverlayItemContent v-bind="$attrs" data-tauri-drag-region>
      <Icon name="lucide:grip" class="size-[50%] pointer-events-none" />
    </OverlayItemContent>
  </OverlayItem>
</template>
