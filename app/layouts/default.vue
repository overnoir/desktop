<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";
</script>

<template>
  <Html :class="{ 'rounded-2xl': isMacOS }">
    <Body :class="{ 'rounded-2xl': isMacOS }">
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex h-screen pt-8.25">
        <LayoutNavbar />
        <main
          class="p-8.25 pb-33 w-full overflow-auto border-l border-t rounded-tl-2xl"
        >
          <slot />
        </main>
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
