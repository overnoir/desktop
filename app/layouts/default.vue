<script setup lang="ts">
import "vue-sonner/style.css";
</script>

<template>
  <div class="flex min-h-screen">
    <LayoutNavbar />
    <div class="w-full">
      <LayoutHeader />
      <main class="p-4">
        <slot />
      </main>
    </div>
    <Toaster />
  </div>
</template>
