<template>
  <Html class="rounded-xl">
    <Body class="rounded-xl">
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex">
        <LayoutNavbar />
        <div class="p-36 relative w-full h-screen overflow-auto">
          <LayoutHeader />
          <main>
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
