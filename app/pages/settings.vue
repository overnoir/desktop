<script setup lang="ts">
definePageMeta({
  description: "meta.settings.description",
  title: "meta.settings.title",
});

const { settings } = useSettings();
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
        <NumberField v-model="settings.opacity" :max="100" :min="0" :step="1">
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
  </section>
</template>
