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
        icon: "lucide:info",
        name: "navbar.linkGroups.0.links.1",
        to: "/help",
      },
    ],
  },
  {
    name: "navbar.linkGroups.1.name",
    links: [
      {
        icon: "lucide:palette",
        name: "navbar.linkGroups.1.links.0",
        to: "/settings/interface",
      },
      {
        icon: "lucide:sliders-horizontal",
        name: "navbar.linkGroups.1.links.1",
        to: "/settings/advanced",
      },
    ],
  },
  {
    name: "navbar.linkGroups.2.name",
    links: [
      {
        icon: "simple-icons:discord",
        name: "Discord",
        to: "/discord",
      },
    ],
  },
];
</script>

<template>
  <nav
    class="bg-background p-4 border rounded-xl w-50 shrink-0 sticky top-0 flex gap-2 flex-col"
  >
    <ul v-for="{ links, name } in linkGroups" :key="name">
      <h1 class="text-muted-foreground text-xs font-semibold mb-1">
        {{ $t(name) }}
      </h1>
      <li v-for="{ name: linkName, to, icon } in links" :key="linkName">
        <Button
          :variant="$route.path === $localePath(to) ? 'outline' : 'ghost'"
          class="w-full justify-start text-xs"
          :class="{
            'border-0 ring ring-inset ring-border':
              $route.path === $localePath(to),
          }"
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
  </nav>
</template>
