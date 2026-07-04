<script setup lang="ts">
const { general, connectors } = storeToRefs(useLinkGroupsStore());
</script>

<template>
  <nav class="w-50 p-4 pt-0 shrink-0 flex flex-col space-y-4">
    <ul v-for="(group, i) in [general, connectors]" :key="i" class="space-y-0">
      <h1 class="text-[.7rem] font-medium mb-1">
        {{ group.name }}
      </h1>
      <li v-for="({ name, to, icon, links }, j) in group.links" :key="j">
        <div>
          <Button
            class="w-full justify-start"
            size="default"
            :variant="
              $route.path === to || links?.some(({ to }) => $route.path === to)
                ? 'secondary'
                : 'ghost'
            "
            as-child
          >
            <NuxtLink :to>
              <Icon v-if="icon" :name="icon" class="size-4.5 mr-1" />
              {{ name }}
            </NuxtLink>
          </Button>
          <ul v-if="links" class="ml-5 border-l">
            <li v-for="(link, k) in links" :key="k" class="ml-2.5">
              <Button
                class="w-full text-secondary-foreground h-7 justify-start font-normal"
                variant="ghost"
                size="sm"
                as-child
              >
                <NuxtLink :to="link.to">
                  {{ link.name }}
                </NuxtLink>
              </Button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
