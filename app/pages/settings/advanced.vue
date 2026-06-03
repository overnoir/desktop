<script setup lang="ts">
const mainWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const overlayWebviewWindow = (
  await tauriWebviewWindowGetAllWebviewWindows()
).find(({ label }) => label === WebviewWindow.Overlay);
const appSettingsStore = useAppSettingsStore();
const { appSettings } = storeToRefs(appSettingsStore);
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

async function resetSettings() {
  if (!overlayWebviewWindow) {
    return;
  }

  const { preventCapture, ignoreCursor } = defaultAppSettings;

  appSettingsStore.reset();

  await overlayWebviewWindow.setContentProtected(preventCapture);
  await mainWebviewWindow.setContentProtected(preventCapture);
  await overlayWebviewWindow.setPosition(
    new TauriWindowLogicalPosition(appSettings.value.x, appSettings.value.y),
  );
  await updateIgnoreCursor(ignoreCursor);
  await tauriAutoStartDisable();

  $toast(t("settings.advanced.reset.success"));
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-between"
  >
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.advanced.isDraggable.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.isDraggable.description") }}
        </p>
      </div>
      <Switch
        v-model="appSettings.isDraggable"
        class="justify-self-end shrink-0"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">
          {{ $t("settings.advanced.showSettings.title") }}
        </h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.showSettings.description") }}
        </p>
      </div>
      <Switch
        v-model="appSettings.showSettings"
        class="justify-self-end shrink-0"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.advanced.autoStart.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.autoStart.description") }}
        </p>
      </div>
      <Switch
        v-model="appSettings.autoStart"
        class="justify-self-end shrink-0"
        @update:model-value="
          $event ? tauriAutoStartEnable() : tauriAutoStartDisable()
        "
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">
          {{ $t("settings.advanced.ignoreCursor.title") }}
        </h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.ignoreCursor.description") }}
        </p>
      </div>
      <Switch
        v-model="appSettings.ignoreCursor"
        class="justify-self-end shrink-0"
        @update:model-value="updateIgnoreCursor($event)"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">
          {{ $t("settings.advanced.preventCapture.title") }}
        </h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.preventCapture.description") }}
        </p>
      </div>
      <Switch
        v-model="appSettings.preventCapture"
        class="justify-self-end shrink-0"
        @update:model-value="
          overlayWebviewWindow &&
            overlayWebviewWindow.setContentProtected($event);
          mainWebviewWindow.setContentProtected($event);
        "
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.advanced.reset.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.advanced.reset.description") }}
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive" class="justify-self-end shrink-0">
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
            <AlertDialogAction variant="destructive" @click="resetSettings">
              {{ $t("settings.advanced.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </section>
</template>
