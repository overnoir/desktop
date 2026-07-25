<script setup lang="ts">
const { social, legal } = useLinkGroups();
const { $toast } = useNuxtApp();
const appInfo = shallowRef("");

try {
  const [version, name] = await Promise.all([
    tauriAppGetVersion(),
    tauriAppGetName(),
  ]);

  appInfo.value = `${name} v${version}`;
} catch (error) {
  $toast.error(getErrorMessage(error));
  await useLogs().logError({ source: LogSource.App, error });
}
</script>

<template>
  <section class="space-y-4">
    <div class="grid grid-cols-3 gap-4">
      <Button
        v-for="(link, i) in social"
        :key="i"
        variant="outline"
        class="justify-start"
        @click="tauriOpenerOpenUrl(link.to)"
      >
        <Icon v-if="link.icon" :name="link.icon" />
        {{ link.name }}
      </Button>
    </div>
    <Separator />
    <div class="flex items-center gap-4">
      <span class="text-xs text-secondary-foreground font-medium mr-auto">
        {{ appInfo }}
      </span>
      <Button
        v-for="(link, i) in legal"
        :key="i"
        variant="link"
        class="text-secondary-foreground text-xs p-0 h-auto"
        size="sm"
        @click="tauriOpenerOpenUrl(link.to)"
      >
        {{ link.name }}
      </Button>
    </div>
  </section>
</template>
