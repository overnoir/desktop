<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

definePageMeta({
  layout: false,
});

async function openMain() {
  await invoke("open_main");
}
</script>

<template>
  <section>
    <Button @click="openMain">Open Main</Button>
  </section>
</template>
