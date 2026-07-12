<script setup lang="ts">
definePageMeta({
  layout: "stream",
});

const { loading, stream } = await useStream().listen();
</script>

<template>
  <section class="flex flex-col h-full">
    <div
      v-if="loading"
      class="absolute inset-0 grid place-items-center pointer-events-none"
    >
      <Spinner class="size-8" />
    </div>
    <template v-if="stream.platform === StreamPlatform.Kick">
      <iframe
        :src="`https://player.kick.com/${stream.slug}?autoplay=true&muted=false`"
        class="w-full flex-1 min-h-0"
        frameborder="0"
        loading="lazy"
        scrolling="no"
        @load="loading = false"
      />
      <Button
        class="shrink-0 rounded-none mt-auto bg-[#00e701] hover:bg-[#00e701]/90"
        @click="tauriOpenerOpenUrl(`https://kick.com/${stream.slug}`)"
      >
        {{ $t("stream.watchOnKick") }}
        <Icon name="lucide:external-link" />
      </Button>
    </template>
  </section>
</template>
