<script setup lang="ts">
const settingsStore = useSettingsStore();
const { general, advanced } = storeToRefs(settingsStore);
const { getByLabel, getCurrent } = useWebviewWindow();
const overlayWebviewWindow = await getByLabel({
  label: WebviewWindowLabel.Overlay,
});
const { currentWebviewWindow } = getCurrent();
const { $toast } = useNuxtApp();
const { t } = useI18n();

async function updatePreventCapture(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  const streamWebviewWindow = await getByLabel({
    label: WebviewWindowLabel.Stream,
  });

  if (streamWebviewWindow) {
    await streamWebviewWindow.setContentProtected(value);
  }

  await overlayWebviewWindow.setContentProtected(value);
  await currentWebviewWindow.setContentProtected(value);
}

async function updateAlwaysOnTop(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  const streamWebviewWindow = await getByLabel({
    label: WebviewWindowLabel.Stream,
  });

  if (streamWebviewWindow) {
    await streamWebviewWindow.setAlwaysOnTop(value);
  }

  await overlayWebviewWindow.setAlwaysOnTop(value);
  await currentWebviewWindow.setAlwaysOnTop(value);
}

async function reset() {
  if (!overlayWebviewWindow) {
    return;
  }

  settingsStore.reset();

  if (advanced.value.autoStart !== (await tauriAutoStartIsEnabled())) {
    if (advanced.value.autoStart) {
      await tauriAutoStartEnable();
    } else {
      await tauriAutoStartDisable();
    }
  }

  if (
    advanced.value.alwaysOnTop !== (await overlayWebviewWindow.isAlwaysOnTop())
  ) {
    await updateAlwaysOnTop(advanced.value.alwaysOnTop);
  }

  await overlayWebviewWindow.setIgnoreCursorEvents(advanced.value.ignoreCursor);
  await overlayWebviewWindow.setPosition(
    new TauriWindowLogicalPosition(general.value.x, general.value.y),
  );
  await updatePreventCapture(advanced.value.preventCapture);

  $toast.success(t("reset.success"));
}
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('settings.ignoreCursor.description')"
      :title="$t('settings.ignoreCursor.title')"
    >
      <Switch
        v-model="advanced.ignoreCursor"
        @update:model-value="
          overlayWebviewWindow?.setIgnoreCursorEvents($event)
        "
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.preventCapture.description')"
      :title="$t('settings.preventCapture.title')"
    >
      <Switch
        v-model="advanced.preventCapture"
        @update:model-value="updatePreventCapture($event)"
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.alwaysOnTop.description')"
      :title="$t('settings.alwaysOnTop.title')"
    >
      <Switch
        v-model="advanced.alwaysOnTop"
        @update:model-value="updateAlwaysOnTop"
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.autoStart.description')"
      :title="$t('settings.autoStart.title')"
    >
      <Switch
        v-model="advanced.autoStart"
        @update:model-value="
          $event ? tauriAutoStartEnable() : tauriAutoStartDisable()
        "
      />
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
            <AlertDialogAction variant="destructive" @click="reset">
              {{ $t("reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
