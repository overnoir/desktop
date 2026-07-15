<script setup lang="ts">
const settingsStore = useSettingsStore();
const { general, advanced } = storeToRefs(settingsStore);
const { getByLabel, getCurrent } = useWebviewWindow();
const overlayWebviewWindow = await getByLabel({
  label: WebviewWindowLabel.Overlay,
});
const { currentWebviewWindow } = getCurrent();
const { $toast } = useNuxtApp();
const { logError } = useLogs();
const { t } = useI18n();

async function updateIgnoreCursorEvents(value: boolean) {
  try {
    if (!overlayWebviewWindow) {
      return;
    }
    await overlayWebviewWindow.setIgnoreCursorEvents(value);
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

async function updateAutoStart(value: boolean) {
  try {
    if (value) {
      await tauriAutoStartEnable();
    } else {
      await tauriAutoStartDisable();
    }
  } catch (error) {
    await logError({ error, source: LogSource.App });
  }
}

async function updateContentProtected(value: boolean) {
  try {
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
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

async function updateAlwaysOnTop(value: boolean) {
  try {
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
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

async function reset() {
  try {
    if (!overlayWebviewWindow) {
      return;
    }

    settingsStore.reset();

    await updateAutoStart(advanced.value.autoStart);

    await updateIgnoreCursorEvents(advanced.value.ignoreCursorEvents);
    await updateContentProtected(advanced.value.contentProtected);
    await updateAlwaysOnTop(advanced.value.alwaysOnTop);

    await overlayWebviewWindow.setPosition(
      new TauriWindowLogicalPosition(general.value.x, general.value.y),
    );

    $toast.success(t("reset.success"));
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ error, source: LogSource.WebviewWindow });
  }
}
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('settings.ignoreCursorEvents.description')"
      :title="$t('settings.ignoreCursorEvents.title')"
    >
      <Switch
        v-model="advanced.ignoreCursorEvents"
        @update:model-value="updateIgnoreCursorEvents($event)"
      />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.contentProtected.description')"
      :title="$t('settings.contentProtected.title')"
    >
      <Switch
        v-model="advanced.contentProtected"
        @update:model-value="updateContentProtected($event)"
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
        @update:model-value="updateAutoStart($event)"
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
