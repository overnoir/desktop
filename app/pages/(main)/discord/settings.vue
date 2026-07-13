<script setup lang="ts">
const discordStore = useDiscordStore();
const { settings } = storeToRefs(discordStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();

function resetSettings() {
  discordStore.resetSettings();
  $toast.success(t("reset.success"));
}
</script>

<template>
  <section class="space-y-4">
    <SettingField
      :description="$t('discord.showMe.description')"
      :title="$t('discord.showMe.title')"
    >
      <Switch v-model="settings.showMe" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showGuild.description')"
      :title="$t('discord.showGuild.title')"
    >
      <Switch v-model="settings.showGuild" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showGuildIconAnimated.description')"
      :title="$t('discord.showGuildIconAnimated.title')"
    >
      <Switch v-model="settings.showGuildIconAnimated" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showSpeakersOnly.description')"
      :title="$t('discord.showSpeakersOnly.title')"
    >
      <Switch v-model="settings.showSpeakersOnly" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showMutedUsers.description')"
      :title="$t('discord.showMutedUsers.title')"
    >
      <Switch v-model="settings.showMutedUsers" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showDeafenedUsers.description')"
      :title="$t('discord.showDeafenedUsers.title')"
    >
      <Switch v-model="settings.showDeafenedUsers" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showBots.description')"
      :title="$t('discord.showBots.title')"
    >
      <Switch v-model="settings.showBots" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.userLimit.description')"
      :title="$t('discord.userLimit.title')"
    >
      <div class="flex flex-col">
        <NumberField v-model="settings.userLimit" :max="50" :min="0">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[settings.userLimit]"
          :max="50"
          :min="0"
          @update:model-value="settings.userLimit = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.displayName.description')"
      :title="$t('discord.displayName.title')"
    >
      <Select v-model="settings.displayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="displayName in Object.values(DiscordDisplayName)"
            :key="displayName"
            :value="displayName"
          >
            {{ $t(`discord.displayName.${displayName}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showDisplayName.description')"
      :title="$t('discord.showDisplayName.title')"
    >
      <Select v-model="settings.showDisplayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="show in Object.values(DiscordShow)"
            :key="show"
            :value="show"
          >
            {{ $t(`discord.show.${show}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showAvatarAnimated.description')"
      :title="$t('discord.showAvatarAnimated.title')"
    >
      <Select v-model="settings.showAvatarAnimated">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="show in Object.values(DiscordShow)"
            :key="show"
            :value="show"
          >
            {{ $t(`discord.show.${show}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
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
            <AlertDialogAction variant="destructive" @click="resetSettings">
              {{ $t("reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
