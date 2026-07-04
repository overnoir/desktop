<script setup lang="ts">
const systemStore = useSystemStore();
const { isConnected } = storeToRefs(systemStore);
const errorsStore = useErrorsStore();
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

async function toggleConnection() {
  loading.value = true;
  const action = isConnected.value ? "disconnect" : "connect";
  try {
    if (action === "connect") {
      await tauriCoreInvoke("connect_system");
    } else {
      await tauriCoreInvoke("disconnect_system");
    }
    isConnected.value = !isConnected.value;
    $toast.success(t(`system.${action}.success`));
  } catch (error) {
    errorsStore.addError({
      message: JSON.stringify(error),
      source: ErrorSource.System,
    });
    $toast.error(t(`system.${action}.error`));
  }
  loading.value = false;
}
</script>

<template>
  <section>
    <Card class="text-center border-0">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ $t("linkGroups.1.links.2.name") }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-8 text-sm">
        <Button
          :variant="isConnected ? 'secondary' : 'default'"
          :loading
          size="lg"
          @click="toggleConnection"
        >
          {{ $t(`system.${isConnected ? "disconnect" : "connect"}.button`) }}
        </Button>
      </CardContent>
    </Card>
  </section>
</template>
