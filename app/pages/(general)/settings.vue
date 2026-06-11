<script setup lang="ts">
import type { Monitor } from "@tauri-apps/api/window";

const mainWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const overlayWebviewWindow = (
  await tauriWebviewWindowGetAllWebviewWindows()
).find(({ label }) => label === WebviewWindow.Overlay);
const monitors = await tauriWindowAvailableMonitors();
const settingsStore = useSettingsStore();
const { advanced, ui } = storeToRefs(settingsStore);
const { t, locales } = useI18n();
const { updateMenu } = useTray();
const { $toast } = useNuxtApp();

async function quickSelect(
  { position, size }: { position: Monitor["position"]; size: Monitor["size"] },
  index: number,
) {
  if (!overlayWebviewWindow) {
    return;
  }

  const { width: overlayWidth, height: overlayHeight } =
    await overlayWebviewWindow.outerSize();
  const { width, height } = size;
  const { x, y } = position;

  const centerY = y + Math.round((height - overlayHeight) / 2);
  const centerX = x + Math.round((width - overlayWidth) / 2);

  const bottomY = y + height - overlayHeight;
  const rightX = x + width - overlayWidth;

  const positions: { x: number; y: number }[] = [
    { x: x, y: y },
    { x: centerX, y: y },
    { x: rightX, y: y },
    { x: x, y: centerY },
    { x: rightX, y: centerY },
    { x: x, y: bottomY },
    { x: centerX, y: bottomY },
    { x: rightX, y: bottomY },
  ];

  const pos = positions[index - (index > 4 ? 1 : 0)];

  if (pos) {
    advanced.value.x = pos.x;
    advanced.value.y = pos.y;

    await overlayWebviewWindow.setPosition(
      new TauriWindowLogicalPosition(advanced.value.x, advanced.value.y),
    );
  }
}

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

  await overlayWebviewWindow.setContentProtected(advanced.value.preventCapture);
  await mainWebviewWindow.setContentProtected(advanced.value.preventCapture);
  await overlayWebviewWindow.setPosition(
    new TauriWindowLogicalPosition(advanced.value.x, advanced.value.y),
  );
  await updateIgnoreCursor(advanced.value.ignoreCursor);
  await tauriAutoStartDisable();

  $toast(t("settings.reset.success"));
}
</script>

<template>
  <section class="grid gap-4">
    <SettingField
      :description="$t('settings.size.description')"
      :title="$t('settings.size.title')"
    >
      <div class="flex flex-col">
        <NumberField
          v-model="ui.size"
          :format-options="{ useGrouping: false }"
          :max="250"
          :min="0"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[ui.size]"
          :max="250"
          :min="0"
          @update:model-value="ui.size = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.orientation.description')"
      :title="$t('settings.orientation.title')"
    >
      <Select v-model="advanced.orientation">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="orientation in Object.values(Orientation)"
            :key="orientation"
            :value="orientation"
          >
            {{ $t(`settings.orientation.${orientation}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.alignment.description')"
      :title="$t('settings.alignment.title')"
    >
      <Select v-model="advanced.alignment">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="alignment in Object.values(Alignment)"
            :key="alignment"
            :value="alignment"
          >
            {{ $t(`settings.alignment.${alignment}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.position.description')"
      :title="$t('settings.position.title')"
    >
      <div class="flex gap-2 max-w-53.5">
        <NumberField
          v-model="advanced.x"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="
            overlayWebviewWindow &&
            overlayWebviewWindow.setPosition(
              new TauriDpiLogicalPosition(advanced.x, advanced.y),
            )
          "
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField
          v-model="advanced.y"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="
            overlayWebviewWindow &&
            overlayWebviewWindow.setPosition(
              new TauriDpiLogicalPosition(advanced.x, advanced.y),
            )
          "
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </SettingField>
    <Accordion type="single" collapsible class="border rounded-lg">
      <AccordionItem value="quick-select" class="w-full">
        <AccordionTrigger class="p-3 font-normal text-xs">
          {{ $t("settings.position.quickSelect") }}
        </AccordionTrigger>
        <AccordionContent class="grid grid-cols-3 gap-3 p-3 pt-0">
          <div v-for="({ name, position, size }, i) in monitors" :key="i">
            <h1 class="text-xs mb-1 text-secondary-foreground">
              {{ name }}
            </h1>
            <Card class="aspect-video grid grid-cols-3 gap-2.5 p-0">
              <template v-for="(_, j) in 9" :key="j">
                <Button
                  v-if="j !== 4"
                  class="rounded-none"
                  variant="outline"
                  :class="{
                    'rounded-tl-lg rounded-br-lg border-l-0 border-t-0':
                      j === 0,
                    'rounded-b-lg border-t-0': j === 1,
                    'rounded-tr-lg rounded-bl-lg border-t-0 border-r-0':
                      j === 2,
                    'rounded-r-lg border-l-0': j === 3,
                    'rounded-l-lg border-r-0': j === 5,
                    'rounded-tr-lg rounded-bl-lg border-l-0 border-b-0':
                      j === 6,
                    'rounded-t-lg border-b-0': j === 7,
                    'rounded-tl-lg rounded-br-lg border-b-0 border-r-0':
                      j === 8,
                  }"
                  @click="quickSelect({ position, size }, j)"
                />
                <div v-else />
              </template>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <Separator />
    <SettingField
      :description="$t('settings.showBackground.description')"
      :title="$t('settings.showBackground.title')"
    >
      <Switch v-model="advanced.showBackground" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.gap.description')"
      :title="$t('settings.gap.title')"
    >
      <div class="flex flex-col">
        <NumberField
          :model-value="ui.gap"
          :format-options="{ useGrouping: false }"
          :min="0"
          :max="100"
          @update:model-value="ui.gap = $event"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[ui.gap]"
          :max="100"
          :min="0"
          @update:model-value="ui.gap = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.opacity.description')"
      :title="$t('settings.opacity.title')"
    >
      <div class="flex flex-col">
        <NumberField
          :model-value="ui.opacity / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="ui.opacity = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[ui.opacity]"
          :max="100"
          :min="0"
          @update:model-value="ui.opacity = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.radius.description')"
      :title="$t('settings.radius.title')"
    >
      <div class="flex flex-col">
        <NumberField
          :model-value="ui.radius / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="ui.radius = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[ui.radius]"
          :max="100"
          :min="0"
          @update:model-value="ui.radius = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.locale.description')"
      :title="$t('settings.locale.title')"
    >
      <Select v-model="advanced.locale" @update:model-value="updateMenu">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="{ code, name } in locales"
            :key="code"
            :value="code"
          >
            {{ name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.isDraggable.description')"
      :title="$t('settings.isDraggable.title')"
    >
      <Switch v-model="advanced.isDraggable" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.showSettings.description')"
      :title="$t('settings.showSettings.title')"
    >
      <Switch v-model="advanced.showSettings" />
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
        @update:model-value="
          overlayWebviewWindow &&
            overlayWebviewWindow.setContentProtected($event);
          mainWebviewWindow.setContentProtected($event);
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
