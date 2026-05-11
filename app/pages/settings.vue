<script setup lang="ts">
import { availableMonitors, type Monitor } from "@tauri-apps/api/window";
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { toast } from "vue-sonner";

definePageMeta({
  title: "meta.settings.title",
});

const allWebviewWindows = await getAllWebviewWindows();
const overlayWebviewWindow = allWebviewWindows.find(
  ({ label }) => label === "overlay",
);
const monitors = await availableMonitors();
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { t, locales } = useI18n();

async function updateWebviewWindowPosition() {
  await overlayWebviewWindow?.setPosition(
    new LogicalPosition(settings.value.x, settings.value.y),
  );
}

async function resetSettings() {
  settingsStore.reset();
  await updateWebviewWindowPosition();
  toast(t("settings.reset.success"));
}

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

  const centerX = x + Math.round((width - overlayWidth) / 2);
  const centerY = y + Math.round((height - overlayHeight) / 2);

  const rightX = x + width - overlayWidth;
  const bottomY = y + height - overlayHeight;

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

  const pos = positions[index - (index > 5 ? 2 : 1)];

  if (pos) {
    settings.value.x = pos.x;
    settings.value.y = pos.y;

    await updateWebviewWindowPosition();
  }
}
</script>

<template>
  <section class="grid gap-4 [&>div]:p-0 [&>div]:gap-0">
    <Card
      class="[&>div]:flex [&>div]:gap-4 [&>div]:items-center [&>div]:justify-between"
    >
      <h1 class="p-4">{{ $t("settings.general") }}</h1>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.theme.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.theme.description") }}
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
              {{ $t(`settings.theme.${theme}`) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.locale.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.locale.description") }}
          </p>
        </div>
        <Select v-model="settings.locale">
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
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.size.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.size.description") }}
          </p>
        </div>
        <div class="flex flex-col justify-self-end shrink-0">
          <NumberField
            :model-value="settings.size / 100"
            :format-options="{ style: 'percent' }"
            :step="0.01"
            :min="0"
            :max="1"
            @update:model-value="settings.size = $event * 100"
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
            :max="100"
            :min="0"
            @update:model-value="settings.size = $event![0]!"
          />
        </div>
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.orientation.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.orientation.description") }}
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
              {{ $t(`settings.orientation.${orientation}`) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.position.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.position.description") }}
          </p>
        </div>
        <div class="flex gap-2 max-w-53.5 justify-self-end shrink-0">
          <NumberField
            v-model="settings.x"
            :format-options="{ useGrouping: false }"
            :min="-9999"
            :max="9999"
            @update:model-value="updateWebviewWindowPosition"
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
            @update:model-value="updateWebviewWindowPosition"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
      <Accordion type="single" collapsible class="border rounded-lg m-4 mt-0">
        <AccordionItem value="quick-select" class="w-full">
          <AccordionTrigger class="p-3 font-normal text-xs">{{
            $t("settings.position.quickSelect")
          }}</AccordionTrigger>
          <AccordionContent class="grid grid-cols-3 gap-3 p-3 pt-0">
            <div v-for="({ name, position, size }, i) in monitors" :key="i">
              <h1 class="text-xs mb-1 text-muted-foreground">
                {{ name }}
              </h1>
              <Card class="aspect-video grid grid-cols-3 gap-2.5 p-0">
                <template v-for="j in 9" :key="j">
                  <Button
                    v-if="j !== 5"
                    class="rounded-none"
                    variant="outline"
                    :class="{
                      'rounded-tl-xl rounded-br-xl border-b-0 border-r-0':
                        j === 9,
                      'rounded-tr-xl rounded-bl-xl border-l-0 border-b-0':
                        j === 7,
                      'rounded-tl-xl rounded-br-xl border-l-0 border-t-0':
                        j === 1,
                      'rounded-tr-xl rounded-bl-xl border-t-0 border-r-0':
                        j === 3,
                      'rounded-b-xl border-t-0': j === 2,
                      'rounded-r-xl border-l-0': j === 4,
                      'rounded-l-xl border-r-0': j === 6,
                      'rounded-t-xl border-b-0': j === 8,
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
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.background.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.background.description") }}
          </p>
        </div>
        <Switch
          v-model="settings.background"
          class="justify-self-end shrink-0"
        />
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.opacity.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.opacity.description") }}
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
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.radius.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.radius.description") }}
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
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.drag.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.drag.description") }}
          </p>
        </div>
        <Switch v-model="settings.drag" class="justify-self-end shrink-0" />
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.settings.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.settings.description") }}
          </p>
        </div>
        <Switch v-model="settings.settings" class="justify-self-end shrink-0" />
      </div>
    </Card>
    <Card
      class="[&>div]:flex [&>div]:gap-4 [&>div]:items-center [&>div]:justify-between"
    >
      <h1 class="p-4">{{ $t("settings.advanced") }}</h1>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.autoStart.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.autoStart.description") }}
          </p>
        </div>
        <Switch
          v-model="settings.autoStart"
          class="justify-self-end shrink-0"
        />
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.ignoreCursor.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.ignoreCursor.description") }}
          </p>
        </div>
        <Switch
          v-model="settings.ignoreCursor"
          class="justify-self-end shrink-0"
        />
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.preventCapture.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.preventCapture.description") }}
          </p>
        </div>
        <Switch
          v-model="settings.preventCapture"
          class="justify-self-end shrink-0"
        />
      </div>
      <Separator />
      <div class="p-4">
        <div>
          <h1 class="text-sm">{{ $t("settings.reset.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.reset.description") }}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive" class="justify-self-end shrink-0">
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
              <AlertDialogAction variant="destructive" @click="resetSettings">
                {{ $t("settings.reset.dialog.confirm") }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  </section>
</template>
