<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

definePageMeta({
  layout: false,
});

async function resize() {
  const body = document.body;
  if (body) {
    invoke("resize_bar", {
      height: body.scrollHeight,
      width: body.scrollWidth,
    });
  }
}

onNuxtReady(() => {
  resize();
});
</script>

<template>
  <Html class="rounded-lg">
    <Body class="size-max">
      <main class="size-max rounded-lg p-0.5 bg-background border-2">
        <Button size="icon" variant="ghost" @click="invoke('open_main')">
          <Icon name="lucide:settings" />
        </Button>
      </main>
    </Body>
  </Html>
</template>
