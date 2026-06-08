<script setup lang="ts">
const discordStore = useDiscordStore();
const { discord } = storeToRefs(discordStore);
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

async function toggleConnection() {
  loading.value = true;
  const action = discord.value.connected ? "disconnect" : "connect";
  try {
    if (action === "connect") {
      discord.value.userId = await tauriCoreInvoke("connect_discord");
    } else {
      await tauriCoreInvoke("disconnect_discord");
      discord.value.userId = undefined;
    }
    discord.value.connected = action === "connect";
    $toast(t(`discord.connection.${action}.success`));
  } catch (error) {
    discordStore.addError(JSON.stringify(error));
    $toast(t(`discord.connection.${action}.error`));
  }
  loading.value = false;
}

async function resetDiscordSettings() {
  discordStore.resetSettings();
  $toast(t("discord.reset.success"));
}
</script>

<template>
  <section class="grid gap-4">
    <template v-if="discord.errors.length">
      <SettingField
        :description="$t('discord.errors.description')"
        :title="`${$t('discord.errors.title')} (${discord.errors.length})`"
      >
        <Button variant="destructive" @click="discordStore.clearErrors">
          {{ $t("discord.errors.clear") }}
        </Button>
      </SettingField>
      <div class="flex flex-col gap-2! max-h-51.5 overflow-auto">
        <Alert
          v-for="{ createdAt, id, message } in discord.errors"
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
                @click="discordStore.removeError(id)"
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
              'bg-green-500': discord.connected,
              'bg-red-500': !discord.connected,
            }"
          />
          {{
            $t(
              `discord.connection.${discord.connected ? "connect" : "disconnect"}.badge`,
            )
          }}
        </Badge>
      </CardHeader>
      <Button
        :class="{
          'bg-[#5865F2] hover:bg-[#5865F2]/90!': discord.connected,
        }"
        :loading
        :variant="discord.connected ? 'ghost' : 'outline'"
        @click="toggleConnection"
      >
        {{
          $t(
            `discord.connection.${discord.connected ? "disconnect" : "connect"}.button`,
          )
        }}
      </Button>
    </Card>
    <Separator />
    <SettingField
      :description="$t('discord.showMe.description')"
      :title="$t('discord.showMe.title')"
    >
      <Switch v-model="discord.settings.showMe" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showOnlySpeakers.description')"
      :title="$t('discord.showOnlySpeakers.title')"
    >
      <Switch v-model="discord.settings.showOnlySpeakers" />
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.userLimit.description')"
      :title="$t('discord.userLimit.title')"
    >
      <div class="flex flex-col">
        <NumberField v-model="discord.settings.userLimit" :max="50" :min="0">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="rounded-b-none border-b-0" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Slider
          class="*:data-[slot='slider-track']:rounded-t-none"
          :model-value="[discord.settings.userLimit]"
          :max="50"
          :min="0"
          @update:model-value="discord.settings.userLimit = $event![0]!"
        />
      </div>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.showDisplayName.description')"
      :title="$t('discord.showDisplayName.title')"
    >
      <Select v-model="discord.settings.showDisplayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="mode in Object.values(ShowDisplayName)"
            :key="mode"
            :value="mode"
          >
            {{ $t(`discord.showDisplayName.${mode}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingField>
    <Separator />
    <SettingField
      :description="$t('discord.displayName.description')"
      :title="$t('discord.displayName.title')"
    >
      <Select v-model="discord.settings.displayName">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="displayName in Object.values(DisplayName)"
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
