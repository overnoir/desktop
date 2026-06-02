<template>
  <Html class="overflow-hidden rounded-lg">
    <Body class="bg-sidebar rounded-lg">
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex mx-1 space-x-1">
        <LayoutNavbar />
        <main
          class="border-t rounded-lg bg-background border p-4 w-full h-[94.5vh] overflow-auto scrollbar-thumb-muted scrollbar-thin"
        >
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
