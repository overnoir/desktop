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
      source: ErrorSource.Discord,
    });
    $toast.error(t(`system.${action}.error`));
  }
  loading.value = false;
}
</script>

<template>
  <section class="space-y-4 max-w-3xl mx-auto">
    <Tabs
      class="flex-row gap-6 [&>div]:not-first:space-y-4"
      default-value="connection"
    >
      <TabsList
        class="flex-col h-max sticky top-10.75 [&>button]:gap-3 [&>button]:w-40 [&>button]:justify-start"
      >
        <TabsTrigger value="connection">
          <Icon name="lucide:plug" />
          {{ $t("system.tabs.0") }}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon name="lucide:sliders-horizontal" />
          {{ $t("system.tabs.1") }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="connection">
        <Card class="text-center gap-12 p-16">
          <CardHeader>
            <CardTitle class="text-xl">
              {{ $t("linkGroups.1.links.0") }}
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-8 text-sm">
            <Button
              :variant="isConnected ? 'secondary' : 'default'"
              :loading
              size="lg"
              @click="toggleConnection"
            >
              {{
                $t(`system.${isConnected ? "disconnect" : "connect"}.button`)
              }}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <SettingField
          :description="$t('system.showCpu.description')"
          :title="$t('system.showCpu.title')"
        >
          <Switch v-model="systemStore.settings.showCpu" />
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('system.showMemory.description')"
          :title="$t('system.showMemory.title')"
        >
          <Switch v-model="systemStore.settings.showMemory" />
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('system.showNetwork.description')"
          :title="$t('system.showNetwork.title')"
        >
          <Switch v-model="systemStore.settings.showNetwork" />
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('system.showBattery.description')"
          :title="$t('system.showBattery.title')"
        >
          <Switch v-model="systemStore.settings.showBattery" />
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('system.reset.description')"
          :title="$t('system.reset.title')"
        >
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive">
                {{ $t("system.reset.title") }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {{ $t("system.reset.dialog.title") }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {{ $t("system.reset.dialog.description") }}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t("system.reset.dialog.cancel") }}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  @click="
                    systemStore.resetSettings();
                    $toast.success(t('system.reset.success'));
                  "
                >
                  {{ $t("system.reset.dialog.confirm") }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingField>
      </TabsContent>
    </Tabs>
  </section>
</template>
