<script setup lang="ts">
import { LogicalPosition, type Monitor } from "@tauri-apps/api/window";

const overlayWebviewWindow = await useWebviewWindow().getByLabel({
  label: WebviewWindowLabel.Overlay,
});
const monitors = await tauriWindowAvailableMonitors();
const settingsStore = useSettingsStore();
const { general } = storeToRefs(settingsStore);
const { updateMenu } = useTray();
const { $toast } = useNuxtApp();
const { logError } = useLogs();
const { locales } = useI18n();

async function updatePosition({ x, y }: { x: number; y: number }) {
  try {
    await overlayWebviewWindow?.setPosition(new LogicalPosition(x, y));
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.WebviewWindow, error });
  }
}

async function quickPositionSelect(
  { position, size }: { position: Monitor["position"]; size: Monitor["size"] },
  index: number,
) {
  try {
    if (!overlayWebviewWindow) {
      return;
    }

    const { width: overlayWidth, height: overlayHeight } =
      await overlayWebviewWindow.outerSize();
    const offset = WEBVIEW_WINDOW_OFFSET;
    const { width, height } = size;
    const { x, y } = position;

    const centerY = y + Math.round((height - overlayHeight) / 2);
    const centerX = x + Math.round((width - overlayWidth) / 2);
    const bottomY = y + height - overlayHeight - offset;
    const rightX = x + width - overlayWidth - offset;

    const positions = [
      { x: x + offset, y: y + offset },
      { x: centerX, y: y + offset },
      { x: rightX, y: y + offset },
      { x: x + offset, y: centerY },
      { x: rightX, y: centerY },
      { x: x + offset, y: bottomY },
      { x: centerX, y: bottomY },
      { x: rightX, y: bottomY },
    ];

    const pos = positions[index - (index > 4 ? 1 : 0)];

    if (pos) {
      await updatePosition({ x: pos.x, y: pos.y });
      general.value.x = pos.x;
      general.value.y = pos.y;
    }
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.WebviewWindow, error });
  }
}

async function updateTray() {
  setTimeout(async () => {
    try {
      await updateMenu();
    } catch (error) {
      $toast.error(getErrorMessage(error));
      await logError({ source: LogSource.Tray, error });
    }
  }, 100);
}
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('settings.orientation.description')"
      :title="$t('settings.orientation.title')"
    >
      <Select v-model="general.orientation">
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
      <Select v-model="general.alignment">
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
      :description="$t('settings.showBackground.description')"
      :title="$t('settings.showBackground.title')"
    >
      <Switch v-model="general.showBackground" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.position.description')"
      :title="$t('settings.position.title')"
    >
      <div class="flex gap-2 max-w-53.5">
        <NumberField
          v-model="general.x"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="updatePosition({ x: $event, y: general.y })"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField
          v-model="general.y"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="updatePosition({ x: general.x, y: $event })"
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
        <AccordionContent class="grid grid-cols-2 gap-3 p-3 pt-0">
          <div v-for="({ name, position, size }, i) in monitors" :key="i">
            <h1 class="text-xs mb-1 text-secondary-foreground">
              {{ name }}
            </h1>
            <Card class="grid grid-cols-3 p-1.5 gap-3">
              <template v-for="(_, j) in 9" :key="j">
                <Button
                  v-if="j !== 4"
                  variant="outline"
                  @click="quickPositionSelect({ position, size }, j)"
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
      :description="$t('settings.showDrag.description')"
      :title="$t('settings.showDrag.title')"
    >
      <Switch v-model="general.showDrag" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.showSettings.description')"
      :title="$t('settings.showSettings.title')"
    >
      <Switch v-model="general.showSettings" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.size.description')"
      :title="$t('settings.size.title')"
    >
      <div class="flex flex-col">
        <NumberField
          v-model="general.size"
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
          :model-value="[general.size]"
          :max="250"
          :min="0"
          @update:model-value="general.size = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.gap.description')"
      :title="$t('settings.gap.title')"
    >
      <div class="flex flex-col">
        <NumberField
          :model-value="general.gap"
          :format-options="{ useGrouping: false }"
          :min="0"
          :max="100"
          @update:model-value="general.gap = $event"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[general.gap]"
          :max="100"
          :min="0"
          @update:model-value="general.gap = $event![0]!"
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
          :model-value="general.opacity / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="general.opacity = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[general.opacity]"
          :max="100"
          :min="0"
          @update:model-value="general.opacity = $event![0]!"
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
          :model-value="general.radius / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="general.radius = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[general.radius]"
          :max="100"
          :min="0"
          @update:model-value="general.radius = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('settings.locale.description')"
      :title="$t('settings.locale.title')"
    >
      <Select v-model="general.locale" @update:model-value="updateTray">
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
  </section>
</template>
