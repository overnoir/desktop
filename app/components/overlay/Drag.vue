<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <OverlayBase>
    <OverlayBaseContent v-bind="$attrs">
      <Icon name="lucide:grip" class="size-[50%]" />
    </OverlayBaseContent>
  </OverlayBase>
</template>
