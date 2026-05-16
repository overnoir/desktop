<template>
  <div class="flex min-h-screen">
    <LayoutTitlebar />
    <LayoutNavbar />
    <main class="p-4 pt-11 w-full">
      <slot />
    </main>
    <SonnerToaster />
  </div>
</template>
