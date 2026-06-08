<script setup lang="ts">
const mainWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const overlayWebviewWindow = (
  await tauriWebviewWindowGetAllWebviewWindows()
).find(({ label }) => label === WebviewWindow.Overlay);
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();

async function updateIgnoreCursor(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  if (tauriOSType() === "macos") {
    await tauriCoreInvoke("set_nspanel_ignore_cursor", { value });
  } else {
    await overlayWebviewWindow.setIgnoreCursorEvents(value);
  }
}

async function reset() {
  if (!overlayWebviewWindow) {
    return;
  }

  settingsStore.reset();

  await overlayWebviewWindow.setContentProtected(settings.value.preventCapture);
  await mainWebviewWindow.setContentProtected(settings.value.preventCapture);
  await overlayWebviewWindow.setPosition(
    new TauriWindowLogicalPosition(settings.value.x, settings.value.y),
  );
  await updateIgnoreCursor(settings.value.ignoreCursor);
  await tauriAutoStartDisable();

  $toast(t("settings.advanced.reset.success"));
}
</script>

<template>
  <section class="grid gap-4">
    <SettingField
      :description="$t('settings.advanced.isDraggable.description')"
      :title="$t('settings.advanced.isDraggable.title')"
    >
      <Switch v-model="settings.isDraggable" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.advanced.showSettings.description')"
      :title="$t('settings.advanced.showSettings.title')"
    >
      <Switch v-model="settings.showSettings" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.advanced.autoStart.description')"
      :title="$t('settings.advanced.autoStart.title')"
    >
      <Switch
        v-model="settings.autoStart"
        @update:model-value="
          $event ? tauriAutoStartEnable() : tauriAutoStartDisable()
        "
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.advanced.ignoreCursor.description')"
      :title="$t('settings.advanced.ignoreCursor.title')"
    >
      <Switch
        v-model="settings.ignoreCursor"
        @update:model-value="updateIgnoreCursor($event)"
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.advanced.preventCapture.description')"
      :title="$t('settings.advanced.preventCapture.title')"
    >
      <Switch
        v-model="settings.preventCapture"
        @update:model-value="
          overlayWebviewWindow &&
            overlayWebviewWindow.setContentProtected($event);
          mainWebviewWindow.setContentProtected($event);
        "
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.advanced.reset.description')"
      :title="$t('settings.advanced.reset.title')"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            {{ $t("settings.advanced.reset.title") }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ $t("settings.advanced.reset.dialog.title") }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t("settings.advanced.reset.dialog.description") }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {{ $t("settings.advanced.reset.dialog.cancel") }}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" @click="reset">
              {{ $t("settings.advanced.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
