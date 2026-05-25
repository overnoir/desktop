<script setup lang="ts">
import { openUrl } from "@tauri-apps/plugin-opener";
</script>

<template>
  <section class="grid grid-cols-2 gap-4">
    <Card
      class="cursor-pointer p-0 hover:bg-card/50"
      @click="openUrl('https://docs.overnoir.com')"
    >
      <CardHeader class="p-4">
        <CardTitle class="flex gap-2 mb-1">
          <Icon name="lucide:book" size="18" />
          {{ $t("help.docs.title") }}
        </CardTitle>
        <CardDescription>
          {{ $t("help.docs.description") }}
        </CardDescription>
      </CardHeader>
    </Card>
    <Card
      class="cursor-pointer p-0 bg-[#5865F2] hover:bg-[#5865F2]/50"
      @click="openUrl('https://discord.com')"
    >
      <CardHeader class="p-4">
        <CardTitle class="text-white flex gap-2 mb-1">
          <Icon name="simple-icons:discord" size="18" />
          Discord
        </CardTitle>
        <CardDescription class="text-white">
          {{ $t("help.discord.description") }}
        </CardDescription>
      </CardHeader>
    </Card>
  </section>
</template>
