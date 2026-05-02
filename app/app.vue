<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

onMounted(async () => {
  await invoke("app_ready");
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
