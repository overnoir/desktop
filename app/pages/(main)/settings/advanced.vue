<script setup lang="ts">
const overlayWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
  WebviewWindowLabel.Overlay,
);
const mainWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const settingsStore = useSettingsStore();
const { general, advanced } = storeToRefs(settingsStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();

async function updateIgnoreCursor(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  if (tauriOSType() === "macos") {
    await tauriCoreInvoke("set_nspanel_ignore_cursor", {
      label: WebviewWindowLabel.Overlay,
      value,
    });
  } else {
    await overlayWebviewWindow.setIgnoreCursorEvents(value);
  }
}

async function updatePreventCapture(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  const streamWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
    WebviewWindowLabel.Stream,
  );

  if (streamWebviewWindow) {
    await streamWebviewWindow.setContentProtected(value);
  }

  await overlayWebviewWindow.setContentProtected(value);
  await mainWebviewWindow.setContentProtected(value);
}

async function updateAlwaysOnTop(value: boolean) {
  if (!overlayWebviewWindow) {
    return;
  }

  const streamWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
    WebviewWindowLabel.Stream,
  );

  if (tauriOSType() === "macos") {
    if (streamWebviewWindow) {
      await tauriCoreInvoke("set_nspanel_always_on_top", {
        label: WebviewWindowLabel.Stream,
        value: value,
      });
    }
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      label: WebviewWindowLabel.Overlay,
      value: value,
    });
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      label: WebviewWindowLabel.Main,
      value: value,
    });
  } else {
    if (streamWebviewWindow) {
      streamWebviewWindow.setAlwaysOnTop(value);
    }
    await overlayWebviewWindow.setAlwaysOnTop(value);
    await mainWebviewWindow.setAlwaysOnTop(value);
  }
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

  await overlayWebviewWindow.setPosition(
    new TauriWindowLogicalPosition(general.value.x, general.value.y),
  );
  await updatePreventCapture(advanced.value.preventCapture);
  await updateIgnoreCursor(advanced.value.ignoreCursor);

  $toast.success(t("settings.reset.success"));
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
        @update:model-value="updateIgnoreCursor($event)"
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
      :description="$t('settings.reset.description')"
      :title="$t('settings.reset.title')"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            {{ $t("settings.reset.title") }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ $t("settings.reset.dialog.title") }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t("settings.reset.dialog.description") }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {{ $t("settings.reset.dialog.cancel") }}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" @click="reset">
              {{ $t("settings.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
