<template>
  <Html class="rounded-lg overflow-hidden">
    <Body class="rounded-lg border">
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex p-1 pt-0 space-x-1 bg-sidebar">
        <LayoutNavbar />
        <main
          class="rounded-lg bg-background border p-4 w-full h-[94.4vh] overflow-auto"
        >
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
