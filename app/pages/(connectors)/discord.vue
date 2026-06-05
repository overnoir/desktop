<script setup lang="ts">
const discordStateStore = useDiscordStateStore();
const { discordState } = storeToRefs(discordStateStore);
const discordSettingsStore = useDiscordSettingsStore();
const { discordSettings } = storeToRefs(discordSettingsStore);
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

async function toggleConnection() {
  loading.value = true;
  const action = discordState.value.connected ? "disconnect" : "connect";
  try {
    await tauriCoreInvoke(`${action}_discord`);
    discordState.value.connected = action === "connect";
    $toast(t(`discord.connection.${action}.success`));
  } catch (error) {
    discordStateStore.addError(JSON.stringify(error));
    $toast(t(`discord.connection.${action}.error`));
  }
  loading.value = false;
}

async function resetDiscordSettings() {
  discordSettingsStore.reset();
  $toast(t("discord.reset.success"));
}
</script>

<template>
  <section class="grid gap-4">
    <template v-if="discordState.errors.length">
      <SettingField
        :description="$t('discord.errors.description')"
        :title="$t('discord.errors.title')"
      >
        <Button variant="destructive" @click="discordStateStore.clearErrors">
          {{ $t("discord.errors.clear") }}
        </Button>
      </SettingField>
      <div class="flex-col gap-2! max-h-51.5 overflow-auto">
        <Alert
          v-for="{ createdAt, id, message } in discordState.errors"
          :key="id"
          variant="destructive"
        >
          <AlertTitle class="line-clamp-none">
            <div class="flex justify-between">
              {{ message }}
              <Button
                variant="secondary"
                class="size-5"
                size="icon"
                @click="discordStateStore.removeError(id)"
              >
                <Icon name="lucide:x" />
              </Button>
            </div>
          </AlertTitle>
          <AlertDescription class="text-xs">
            {{ new Date(createdAt).toLocaleString() }}
          </AlertDescription>
        </Alert>
      </div>
      <Separator />
    </template>
    <Card class="w-full p-4 gap-4">
      <CardHeader class="flex items-start p-0 gap-4">
        <div>
          <div
            class="bg-[#5865F2] text-white size-10 rounded-lg grid place-items-center"
          >
            <Icon name="simple-icons:discord" size="25" />
          </div>
        </div>
        <div class="space-y-1">
          <CardTitle>Discord RPC</CardTitle>
          <CardDescription>Rich Presence Connection</CardDescription>
        </div>
        <Badge variant="outline" class="ml-auto">
          <div
            class="size-2 rounded-full mr-0.5"
            :class="{
              'bg-green-500': discordState.connected,
              'bg-red-500': !discordState.connected,
            }"
          />
          {{
            $t(
              `discord.connection.${discordState.connected ? "connect" : "disconnect"}.badge`,
            )
          }}
        </Badge>
      </CardHeader>
      <Button
        :class="{
          'bg-[#5865F2] hover:bg-[#5865F2]/90!': discordState.connected,
        }"
        :loading
        :variant="discordState.connected ? 'ghost' : 'outline'"
        @click="toggleConnection"
      >
        {{
          $t(
            `discord.connection.${discordState.connected ? "disconnect" : "connect"}.button`,
          )
        }}
      </Button>
    </Card>
    <Separator />
    <SettingField
      :description="$t('discord.showMe.description')"
      :title="$t('discord.showMe.title')"
    >
      <Switch v-model="discordSettings.showMe" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showOnlySpeakers.description')"
      :title="$t('discord.showOnlySpeakers.title')"
    >
      <Switch v-model="discordSettings.showOnlySpeakers" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.displayName.description')"
      :title="$t('discord.displayName.title')"
    >
      <Select v-model="discordSettings.displayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="displayName in Object.values(VoiceUserDisplayName)"
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
      :description="$t('discord.reset.description')"
      :title="$t('discord.reset.title')"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            {{ $t("discord.reset.title") }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ $t("discord.reset.dialog.title") }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t("discord.reset.dialog.description") }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {{ $t("discord.reset.dialog.cancel") }}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              @click="resetDiscordSettings"
            >
              {{ $t("discord.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingField>
  </section>
</template>
