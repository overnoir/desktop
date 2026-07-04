<script setup lang="ts">
const { general, connectors } = storeToRefs(useLinkGroupsStore());
const navbar = ref();
const { arrivedState } = useScroll(navbar);
</script>

<template>
  <nav
    ref="navbar"
    class="w-50 p-4 pt-0 shrink-0 flex flex-col space-y-4 overflow-auto"
    :class="{
      'mask-b-from-90%': !arrivedState.bottom,
      'mask-t-from-90%': !arrivedState.top,
    }"
  >
    <ul
      v-for="(group, i) in [general, connectors]"
      :key="i"
      class="space-y-0.5"
    >
      <h1 class="text-[.7rem] font-medium">
        {{ group.name }}
      </h1>
      <li
        v-for="({ name, to, icon, links }, j) in group.links"
        :key="j"
        class="space-y-0.5"
      >
        <Button
          :variant="$route.path === to && !links ? 'outline' : 'ghost'"
          :class="{
            'border-0 ring ring-inset ring-border':
              $route.path === to && !links,
          }"
          class="w-full justify-start"
          size="default"
          as-child
        >
          <NuxtLink :to>
            <Icon v-if="icon" :name="icon" class="size-4.5 mr-1" />
            {{ name }}
          </NuxtLink>
        </Button>
        <ul v-if="links" class="ml-5.25 border-l space-y-0.5">
          <li v-for="(link, k) in links" :key="k" class="ml-2.5">
            <Button
              :class="{
                'border-0 ring ring-inset ring-border': $route.path === link.to,
              }"
              :variant="$route.path === link.to ? 'outline' : 'ghost'"
              class="w-full text-[.8rem] justify-start"
              size="sm"
              as-child
            >
              <NuxtLink :to="link.to">
                {{ link.name }}
              </NuxtLink>
            </Button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
