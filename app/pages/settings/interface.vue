<script setup lang="ts">
import type { Monitor } from "@tauri-apps/api/window";

const overlayWebviewWindow = (
  await tauriWebviewWindowGetAllWebviewWindows()
).find(({ label }) => label === WebviewWindow.Overlay);
const monitors = await tauriWindowAvailableMonitors();
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { updateMenu } = useTray();
const { locales } = useI18n();

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
    settings.value.x = pos.x;
    settings.value.y = pos.y;

    await overlayWebviewWindow.setPosition(
      new TauriWindowLogicalPosition(settings.value.x, settings.value.y),
    );
  }
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-between"
  >
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.theme.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.theme.description") }}
        </p>
      </div>
      <Select v-model="settings.theme">
        <SelectTrigger class="justify-self-end shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="theme in Object.values(Theme)"
            :key="theme"
            :value="theme"
          >
            {{ $t(`settings.interface.theme.${theme}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.locale.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.locale.description") }}
        </p>
      </div>
      <Select v-model="settings.locale" @update:model-value="updateMenu">
        <SelectTrigger class="justify-self-end shrink-0">
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
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.size.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.size.description") }}
        </p>
      </div>
      <div class="flex flex-col justify-self-end shrink-0">
        <NumberField
          v-model="settings.size"
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
          :model-value="[settings.size]"
          :max="250"
          :min="0"
          @update:model-value="settings.size = $event![0]!"
        />
      </div>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">
          {{ $t("settings.interface.orientation.title") }}
        </h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.orientation.description") }}
        </p>
      </div>
      <Select v-model="settings.orientation">
        <SelectTrigger class="justify-self-end shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="orientation in Object.values(Orientation)"
            :key="orientation"
            :value="orientation"
          >
            {{ $t(`settings.interface.orientation.${orientation}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.position.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.position.description") }}
        </p>
      </div>
      <div class="flex gap-2 max-w-53.5 justify-self-end shrink-0">
        <NumberField
          v-model="settings.x"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="
            overlayWebviewWindow &&
            overlayWebviewWindow.setPosition(
              new TauriDpiLogicalPosition(settings.x, settings.y),
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
          v-model="settings.y"
          :format-options="{ useGrouping: false }"
          :min="-9999"
          :max="9999"
          @update:model-value="
            overlayWebviewWindow &&
            overlayWebviewWindow.setPosition(
              new TauriDpiLogicalPosition(settings.x, settings.y),
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
    </div>
    <Accordion type="single" collapsible class="border rounded-lg">
      <AccordionItem value="quick-select" class="w-full">
        <AccordionTrigger class="p-3 font-normal text-xs">
          {{ $t("settings.interface.position.quickSelect") }}
        </AccordionTrigger>
        <AccordionContent class="grid grid-cols-3 gap-3 p-3 pt-0">
          <div v-for="({ name, position, size }, i) in monitors" :key="i">
            <h1 class="text-xs mb-1 text-muted-foreground">
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
    <div>
      <div>
        <h1 class="text-sm">
          {{ $t("settings.interface.showBackground.title") }}
        </h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.showBackground.description") }}
        </p>
      </div>
      <Switch
        v-model="settings.showBackground"
        class="justify-self-end shrink-0"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.opacity.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.opacity.description") }}
        </p>
      </div>
      <div class="flex flex-col justify-self-end shrink-0">
        <NumberField
          :model-value="settings.opacity / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="settings.opacity = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[settings.opacity]"
          :max="100"
          :min="0"
          @update:model-value="settings.opacity = $event![0]!"
        />
      </div>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("settings.interface.radius.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.interface.radius.description") }}
        </p>
      </div>
      <div class="flex flex-col justify-self-end shrink-0">
        <NumberField
          :model-value="settings.radius / 100"
          :format-options="{ style: 'percent' }"
          :step="0.01"
          :min="0"
          :max="1"
          @update:model-value="settings.radius = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[settings.radius]"
          :max="100"
          :min="0"
          @update:model-value="settings.radius = $event![0]!"
        />
      </div>
    </div>
  </section>
</template>
