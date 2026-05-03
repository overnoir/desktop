<template>
  <div class="flex min-h-screen">
    <LayoutNavbar />
    <div class="w-full">
      <LayoutHeader />
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
