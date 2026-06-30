<script setup lang="ts">
const { general, connectors, community, activeLink } =
  storeToRefs(useLinkGroupsStore());
</script>

<template>
  <nav
    class="p-4 pt-10 w-60 shrink-0 flex flex-col gap-4 border-r [&>ul]:last:mt-auto"
  >
    <ul
      v-for="({ links, name }, i) in [general, connectors, community]"
      :key="i"
      class="space-y-1"
    >
      <h1 v-if="name" class="mb-2 text-[.7rem] font-medium">
        {{ name }}
      </h1>
      <li v-for="{ name: linkName, to, icon } in links" :key="to">
        <Button
          :variant="activeLink.to === to ? 'secondary' : 'ghost'"
          :class="{
            'text-secondary-foreground!': activeLink.to !== to,
          }"
          class="w-full justify-start text-foreground"
          size="lg"
          as-child
        >
          <NuxtLink :to>
            <Icon :name="icon" class="size-4.5 mr-2" />
            {{ linkName }}
          </NuxtLink>
        </Button>
      </li>
    </ul>
  </nav>
</template>
