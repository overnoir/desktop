<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <OverlayItem>
    <OverlayItemContent v-bind="$attrs">
      <Icon name="lucide:grip" class="size-[50%]" />
    </OverlayItemContent>
  </OverlayItem>
</template>
