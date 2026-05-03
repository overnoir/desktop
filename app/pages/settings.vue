<script setup lang="ts">
definePageMeta({
  description: "meta.settings.description",
  title: "meta.settings.title",
});

const { settings, reset } = useSettings();
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1>{{ $t("settings.theme.title") }}</h1>
      <p class="text-muted-foreground text-xs">
        {{ $t("settings.theme.description") }}
      </p>
      <div class="grid grid-cols-3 gap-2 mt-4">
        <Button
          :variant="settings.theme === 'light' ? 'outline' : 'secondary'"
          @click="settings.theme = 'light'"
        >
          <Icon name="lucide:sun" />
          {{ $t("settings.theme.list.0") }}
        </Button>
        <Button
          :variant="settings.theme === 'dark' ? 'outline' : 'secondary'"
          @click="settings.theme = 'dark'"
        >
          <Icon name="lucide:moon" />
          {{ $t("settings.theme.list.1") }}
        </Button>
        <Button
          :variant="settings.theme === 'system' ? 'outline' : 'secondary'"
          @click="settings.theme = 'system'"
        >
          <Icon name="lucide:monitor" />
          {{ $t("settings.theme.list.2") }}
        </Button>
      </div>
    </div>
    <div>
      <div>
        <h1>{{ $t("settings.drag.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.drag.description") }}
        </p>
      </div>
      <Switch v-model="settings.drag" class="mt-4" />
    </div>
    <div>
      <div>
        <h1>{{ $t("settings.opacity.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.opacity.description") }}
        </p>
      </div>
      <div class="flex items-center mt-4 gap-6">
        <Slider
          :model-value="[settings.opacity]"
          :max="100"
          :step="1"
          :min="0"
          @update:model-value="settings.opacity = $event![0]!"
        />
        <NumberField
          :model-value="settings.opacity / 100"
          :format-options="{
            style: 'percent',
          }"
          :step="0.01"
          @update:model-value="settings.opacity = $event * 100"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
    <div>
      <h1>{{ $t("settings.orientation.title") }}</h1>
      <p class="text-muted-foreground text-xs">
        {{ $t("settings.orientation.description") }}
      </p>
      <div class="grid grid-cols-2 gap-2 mt-4">
        <Button
          :variant="
            settings.orientation === 'horizontal' ? 'outline' : 'secondary'
          "
          @click="settings.orientation = 'horizontal'"
        >
          <Icon name="lucide:rectangle-horizontal" />
          {{ $t("settings.orientation.list.0") }}
        </Button>
        <Button
          :variant="
            settings.orientation === 'vertical' ? 'outline' : 'secondary'
          "
          @click="settings.orientation = 'vertical'"
        >
          <Icon name="lucide:rectangle-vertical" />
          {{ $t("settings.orientation.list.1") }}
        </Button>
      </div>
    </div>
    <div>
      <div>
        <h1>{{ $t("settings.position.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("settings.position.description") }}
        </p>
      </div>
      <div class="grid grid-cols-2 mt-4 gap-2">
        <NumberField
          v-model="settings.x"
          :format-options="{ useGrouping: false }"
          :step="1"
        >
          <Label>X (px)</Label>
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
        >
          <Label>Y (px)</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
    <div>
      <h1>{{ $t("settings.reset.title") }}</h1>
      <p class="text-muted-foreground text-xs">
        {{ $t("settings.reset.description") }}
      </p>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive" class="mt-4">
            <Icon name="lucide:rotate-ccw" />
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
    </div>
  </section>
</template>
