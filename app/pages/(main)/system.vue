<script setup lang="ts">
const systemStore = useSystemStore();
const { settings } = storeToRefs(systemStore);
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('system.showCpu.description')"
      :title="$t('system.showCpu.title')"
    >
      <Switch v-model="settings.showCpu" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('system.showMemory.description')"
      :title="$t('system.showMemory.title')"
    >
      <Switch v-model="settings.showMemory" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('system.showNetwork.description')"
      :title="$t('system.showNetwork.title')"
    >
      <Switch v-model="settings.showNetwork" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('system.showBattery.description')"
      :title="$t('system.showBattery.title')"
    >
      <Switch v-model="settings.showBattery" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('reset.description')"
      :title="$t('reset.title')"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            {{ $t("reset.title") }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ $t("reset.dialog.title") }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t("reset.dialog.description") }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {{ $t("reset.dialog.cancel") }}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              @click="
                systemStore.resetSettings();
                $toast.success($t('reset.success'));
              "
            >
              {{ $t("reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
