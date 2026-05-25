<script setup lang="ts">
const { discord } = storeToRefs(useDiscordStore());
</script>

<template>
  <section>
    <Switch v-model="discord.isEnabled" />
  </section>
</template>
