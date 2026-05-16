<script setup lang="ts">
import { getVersion } from "@tauri-apps/api/app";

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
        name: "Discord",
        to: "/#",
      },
    ],
  },
];

const version = await getVersion();
</script>

<template>
  <nav
    class="border-r p-4 pt-12 w-50 shrink-0 sticky top-0 h-screen flex flex-col bg-sidebar"
  >
    <NuxtLinkLocale
      class="inline-flex items-center gap-2 select-none size-max"
      to="/"
    >
      <NuxtImg src="/logo.png" alt="Logo" class="size-8 pointer-events-none" />
      <span class="font-semibold"> Overnoir </span>
    </NuxtLinkLocale>
    <ul v-for="{ links, name } in linkGroups" :key="name" class="mt-4">
      <h1 class="text-muted-foreground text-xs font-semibold mb-1">
        {{ $t(name) }}
      </h1>
      <li v-for="{ name: linkName, to, icon } in links" :key="linkName">
        <Button
          :variant="$route.path === $localePath(to) ? 'secondary' : 'ghost'"
          class="w-full justify-start text-xs"
          size="sm"
          as-child
        >
          <NuxtLinkLocale :to>
            <Icon :name="icon" class="mr-1" />
            {{ $te(linkName) ? $t(linkName) : linkName }}
          </NuxtLinkLocale>
        </Button>
      </li>
    </ul>
    <span class="text-muted-foreground text-xs mt-auto">v{{ version }}</span>
  </nav>
</template>
