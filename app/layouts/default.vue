<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";
</script>

<template>
  <Html :class="{ 'rounded-2xl': isMacOS }">
    <Body :class="{ 'rounded-2xl': isMacOS }">
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex">
        <LayoutNavbar />
        <div class="w-full h-screen overflow-auto">
          <LayoutHeader />
          <main class="pb-21 p-10">
            <slot />
          </main>
        </div>
      </div>
    </Body>
  </Html>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
