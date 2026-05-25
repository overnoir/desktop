<template>
  <Body class="bg-sidebar">
    <LayoutTitlebar />
    <SonnerToaster />
    <div class="flex mx-1 space-x-1">
      <LayoutNavbar />
      <main
        class="border-t rounded-lg bg-background border p-4 w-full h-[94vh] overflow-auto scrollbar-thumb-muted scrollbar-thin"
      >
        <slot />
      </main>
    </div>
  </Body>
</template>
