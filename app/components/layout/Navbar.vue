<script setup lang="ts">
const linkGroups: LinkGroup[] = [
  {
    name: "navbar.linkGroups.0.name",
    links: [
      {
        icon: "lucide:home",
        name: "navbar.linkGroups.0.links.0",
        to: "/",
      },
      {
        icon: "lucide:settings",
        name: "navbar.linkGroups.0.links.1",
        to: "/settings",
      },
    ],
  },
  {
    name: "navbar.linkGroups.1.name",
    links: [
      {
        icon: "bi:discord",
        name: "navbar.linkGroups.1.links.0",
        to: "/discord",
      },
      {
        icon: "simple-icons:kick",
        name: "navbar.linkGroups.1.links.1",
        to: "/kick",
      },
      {
        icon: "bi:steam",
        name: "navbar.linkGroups.1.links.2",
        to: "/steam",
      },
    ],
  },
];
</script>

<template>
  <nav class="border-r p-4 w-50 shrink-0 sticky top-0 h-screen flex flex-col">
    <NuxtImg src="/logo.png" alt="Logo" class="size-10" />
    <ul v-for="linkGroup in linkGroups" :key="linkGroup.name" class="mt-4">
      <h1 class="text-muted-foreground text-xs font-semibold mb-1">
        {{ $t(linkGroup.name) }}
      </h1>
      <li v-for="link in linkGroup.links" :key="link.name">
        <Button
          :variant="
            $route.path === $localePath(link.to) ? 'secondary' : 'ghost'
          "
          class="w-full justify-start text-xs"
          size="sm"
          as-child
        >
          <NuxtLinkLocale :to="link.to">
            <Icon :name="link.icon" class="mr-1" />
            {{ $t(link.name) }}
          </NuxtLinkLocale>
        </Button>
      </li>
    </ul>
    <span class="text-muted-foreground text-xs mt-auto">v1.0.0</span>
  </nav>
</template>
