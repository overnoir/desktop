<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";
</script>

<template>
  <Html :class="{ 'rounded-2xl': isMacOS }">
    <Body :class="{ 'rounded-2xl': isMacOS }">
      <LayoutTitlebar :minimize="false" :maximize="false" />
      <main class="h-screen pt-8.25">
        <slot />
      </main>
    </Body>
  </Html>
</template>
