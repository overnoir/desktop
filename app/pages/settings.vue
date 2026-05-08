<script setup lang="ts">
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
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { t } = useI18n();

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
</script>

<template>
  <section>
    <Card
      class="p-4 gap-4 [&>div]:flex [&>div]:gap-5 [&>div]:items-center [&>div]:justify-between"
    >
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.theme.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.theme.description") }}
          </p>
        </div>
        <Select v-model="settings.theme">
          <SelectTrigger class="justify-self-end">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">
              {{ $t("settings.theme.list.0") }}
            </SelectItem>
            <SelectItem value="dark">
              {{ $t("settings.theme.list.1") }}
            </SelectItem>
            <SelectItem value="light">
              {{ $t("settings.theme.list.2") }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.size.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.size.description") }}
          </p>
        </div>
        <NumberField
          v-model="settings.size"
          :format-options="{ useGrouping: false }"
          class="justify-self-end"
          :step="1"
          :min="1"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.orientation.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.orientation.description") }}
          </p>
        </div>
        <Select v-model="settings.orientation">
          <SelectTrigger class="justify-self-end">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">
              {{ $t("settings.orientation.list.0") }}
            </SelectItem>
            <SelectItem value="vertical">
              {{ $t("settings.orientation.list.1") }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.position.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.position.description") }}
          </p>
        </div>
        <div class="flex gap-2 max-w-53.5 justify-self-end">
          <NumberField
            v-model="settings.x"
            :format-options="{ useGrouping: false }"
            :step="1"
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
            :step="1"
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
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.opacity.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.opacity.description") }}
          </p>
        </div>
        <div class="flex flex-col gap-0 justify-self-end">
          <NumberField
            :model-value="settings.opacity / 100"
            :format-options="{ style: 'percent' }"
            :step="0.01"
            @update:model-value="settings.opacity = $event * 100"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput class="rounded-b-none" />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <Slider
            class="*:data-[slot='slider-track']:rounded-t-none"
            :model-value="[settings.opacity]"
            :max="100"
            :step="1"
            :min="0"
            @update:model-value="settings.opacity = $event![0]!"
          />
        </div>
      </div>
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.drag.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.drag.description") }}
          </p>
        </div>
        <Switch v-model="settings.drag" class="justify-self-end" />
      </div>
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("settings.reset.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("settings.reset.description") }}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive" class="justify-self-end">
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
