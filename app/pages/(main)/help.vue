<script setup lang="ts">
const version = await tauriAppGetVersion();
const name = await tauriAppGetName();
</script>

<template>
  <section class="grid grid-cols-2 gap-4">
    <Card
      class="cursor-pointer p-0"
      @click="tauriOpenerOpenUrl('https://docs.overnoir.com')"
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
      class="cursor-pointer p-0 bg-[#5865F2]"
      @click="tauriOpenerOpenUrl('https://discord.gg/')"
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
    <span class="col-span-2 text-xs text-secondary-foreground">
      {{ name }} v{{ version }}
    </span>
  </section>
</template>
