<script setup lang="ts">
defineProps<{ network: SystemNetwork }>();

const { boxStyles, nameStyles } = useStyles();
</script>

<template>
  <div class="relative">
    <div
      class="relative bg-background grid place-items-center border overflow-hidden"
      :style="boxStyles"
    >
      <Icon name="lucide:wifi" class="size-[35%]" />
    </div>
    <div
      class="absolute bg-background border left-0 top-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ network.upload.toFixed(2) }}MB
    </div>
    <div
      class="absolute bg-background border left-0 bottom-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ network.download.toFixed(2) }}MB
    </div>
  </div>
</template>
