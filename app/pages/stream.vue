<script setup lang="ts">
definePageMeta({
  layout: "stream",
});

const isLoaded = ref(false);
const router = useRouter();

await tauriEventListen<{ slug: string }>("slug-update", async ({ payload }) => {
  if (router.currentRoute.value.query.slug === payload.slug) {
    return;
  }
  await router.replace({ query: { slug: payload.slug } });
  isLoaded.value = false;
});
</script>

<template>
  <section class="flex flex-col h-full">
    <div
      v-if="!isLoaded"
      class="absolute inset-0 grid place-items-center pointer-events-none"
    >
      <Spinner class="size-8" />
    </div>
    <iframe
      :src="`https://player.kick.com/${router.currentRoute.value.query.slug}?autoplay=true&muted=false&allowfullscreen=false`"
      class="w-full flex-1 min-h-0"
      allowfullscreen="false"
      frameborder="0"
      loading="lazy"
      scrolling="no"
      @load="isLoaded = true"
    />
    <Button
      class="shrink-0 rounded-none mt-auto bg-[#00e701] hover:bg-[#00e701]/90"
      @click="
        tauriOpenerOpenUrl(
          `https://kick.com/${router.currentRoute.value.query.slug}`,
        )
      "
    >
      {{ $t("stream.watchOnKick") }}
      <Icon name="lucide:external-link" />
    </Button>
  </section>
</template>
