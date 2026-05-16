<script setup lang="ts">
import "vue-sonner/style.css";
</script>

<template>
  <div class="flex min-h-screen">
    <LayoutTitlebar />
    <LayoutNavbar />
    <main class="p-4 pt-11 w-full">
      <slot />
    </main>
    <Toaster />
  </div>
</template>
