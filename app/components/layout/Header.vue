<script setup lang="ts">
const { t, te } = useI18n();
const route = useRoute();

const description = computed(() => {
  const value = route.meta.description as string | undefined;
  return value && te(value) ? t(value) : value;
});

const title = computed(() => {
  const value = route.meta.title as string | undefined;
  return value && te(value) ? t(value) : value;
});
</script>

<template>
  <header class="border-b p-4 sticky top-0 bg-background z-40">
    <h1 class="text-xl font-semibold">
      {{ title }}
    </h1>
    <p class="text-muted-foreground text-xs">
      {{ description }}
    </p>
  </header>
</template>
