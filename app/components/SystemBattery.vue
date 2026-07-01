<script setup lang="ts">
defineProps<{ battery: SystemBattery }>();

const { boxStyles, nameStyles, iconStyles, iconsStyles } = useStyles();
</script>

<template>
  <div class="relative">
    <div
      class="relative bg-background grid place-items-center border overflow-hidden"
      :style="boxStyles"
    >
      <Icon name="lucide:battery-full" class="size-[35%]" />
    </div>
    <div
      v-if="battery.isCharging"
      class="absolute bg-background border left-0 top-0 flex items-center"
      :style="iconsStyles"
    >
      <Icon :style="iconStyles" name="lucide:zap" />
    </div>
    <div
      class="absolute bg-background border left-0 bottom-0 text-nowrap overflow-hidden leading-tight"
      :style="nameStyles"
    >
      {{ (battery.percent || 0).toFixed(1) }}%
    </div>
  </div>
</template>
