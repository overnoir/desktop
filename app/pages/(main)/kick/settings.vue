<script setup lang="ts">
const kickStore = useKickStore();
const { settings } = storeToRefs(kickStore);
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('kick.showOnlyLive.description')"
      :title="$t('kick.showOnlyLive.title')"
    >
      <Switch v-model="settings.showOnlyLive" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('kick.displayName.description')"
      :title="$t('kick.displayName.title')"
    >
      <Select v-model="settings.displayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="displayName in Object.values(KickDisplayName)"
            :key="displayName"
            :value="displayName"
          >
            {{ $t(`kick.displayName.${displayName}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('kick.showDisplayName.description')"
      :title="$t('kick.showDisplayName.title')"
    >
      <Select v-model="settings.showDisplayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="show in Object.values(KickShow)"
            :key="show"
            :value="show"
          >
            {{ $t(`kick.show.${show}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('kick.showCategory.description')"
      :title="$t('kick.showCategory.title')"
    >
      <Select v-model="settings.showCategory">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="show in Object.values([KickShow.WhileLive, KickShow.Never])"
            :key="show"
            :value="show"
          >
            {{ $t(`kick.show.${show}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('kick.streamerLimit.description')"
      :title="$t('kick.streamerLimit.title')"
    >
      <div class="flex flex-col">
        <NumberField v-model="settings.streamerLimit" :max="50" :min="0">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[settings.streamerLimit]"
          :max="7"
          :min="0"
          @update:model-value="settings.streamerLimit = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('kick.reset.description')"
      :title="$t('kick.reset.title')"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            {{ $t("kick.reset.title") }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ $t("kick.reset.dialog.title") }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t("kick.reset.dialog.description") }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {{ $t("kick.reset.dialog.cancel") }}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              @click="
                kickStore.resetSettings();
                $toast.success($t('kick.reset.success'));
              "
            >
              {{ $t("kick.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
