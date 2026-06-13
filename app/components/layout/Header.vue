<script setup lang="ts">
const { activeLink } = storeToRefs(useLinkGroupsStore());
const route = useRoute();

const imageUrl = computed(() => route.meta.headerImageUrl as string);
</script>

<template>
  <header class="flex p-10 items-center border-b relative">
    <div class="flex items-center gap-4 z-10">
      <Icon :name="activeLink.icon" class="size-10" />
      <h1 class="text-3xl font-bold">
        {{ activeLink.name }}
      </h1>
    </div>
    <NuxtImg
      v-if="imageUrl"
      :src="imageUrl"
      class="absolute left-0 top-0 h-30 w-full -z-50 object-cover"
      alt="Header Image"
    />
    <div
      class="absolute left-0 top-0 h-30 w-full bg-linear-to-r from-background"
      :class="{
        'via-background/65 to-transparent': imageUrl,
        'via-black/25 to-black/65': !imageUrl,
      }"
    />
  </header>
</template>
