<script setup lang="ts">
const discordStore = useDiscordStore();
const errorsStore = useErrorsStore();
const { connectedUser, settings } = storeToRefs(discordStore);
const deleteVaultItemsOnDisconnect = ref(true);
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

const avatarUrl = computed(
  () =>
    connectedUser.value &&
    generateDiscordUserAvatarUrl({
      avatar: connectedUser.value.avatar,
      id: connectedUser.value.id,
    }),
);

async function toggleConnection() {
  loading.value = true;
  const action = connectedUser.value ? "disconnect" : "connect";
  try {
    if (action === "connect") {
      connectedUser.value =
        await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");
    } else {
      await tauriCoreInvoke("disconnect_discord", {
        deleteVaultItems: deleteVaultItemsOnDisconnect.value,
      });
      if (deleteVaultItemsOnDisconnect.value) {
        deleteVaultItemsOnDisconnect.value = true;
        await discordStore.$tauri.saveAllNow();
      }
      connectedUser.value = null;
    }
    $toast.success(t(`discord.${action}.success`));
  } catch (error) {
    errorsStore.addError({
      message: JSON.stringify(error),
      source: ErrorSource.Discord,
    });
    $toast.error(t(`discord.${action}.error`));
  }
  loading.value = false;
}
</script>

<template>
  <section class="space-y-4">
    <Tabs
      class="flex-row gap-6 [&>div]:not-first:space-y-4"
      default-value="connection"
    >
      <TabsList
        class="flex-col h-max sticky top-0 [&>button]:gap-3 [&>button]:w-40 [&>button]:justify-start"
      >
        <TabsTrigger value="connection">
          <Icon name="lucide:plug" />
          {{ $t("discord.tabs.0") }}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon name="lucide:sliders-horizontal" />
          {{ $t("discord.tabs.1") }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="connection">
        <Card class="text-center gap-12 p-16">
          <CardHeader>
            <CardTitle class="text-xl">Discord RPC</CardTitle>
            <NuxtImg
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="size-20 rounded-lg border mx-auto mt-4 mb-2"
            />
            <CardDescription>
              {{
                connectedUser
                  ? $t("discord.disconnect.description", {
                      username: connectedUser.username,
                    })
                  : $t("discord.connect.description")
              }}
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-8 text-sm">
            <template v-if="connectedUser">
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button variant="secondary" :loading size="lg">
                    {{ $t("discord.disconnect.button") }}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {{ $t("discord.disconnect.dialog.title") }}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {{ $t("discord.disconnect.dialog.description") }}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="delete-vault-items"
                      v-model="deleteVaultItemsOnDisconnect"
                    />
                    <Label for="delete-vault-items">{{
                      $t("discord.disconnect.dialog.deleteVaultItems")
                    }}</Label>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {{ $t("discord.disconnect.dialog.cancel") }}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      @click="toggleConnection"
                    >
                      {{ $t("discord.disconnect.dialog.confirm") }}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </template>
            <Button
              v-else
              class="bg-[#5865F2] hover:bg-[#5865F2]/90!"
              variant="ghost"
              :loading
              size="lg"
              @click="toggleConnection"
            >
              {{ $t("discord.connect.button") }}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
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
                  @click="
                    discordStore.resetSettings();
                    $toast.success(t('discord.reset.success'));
                  "
                >
                  {{ $t("discord.reset.dialog.confirm") }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingField>
      </TabsContent>
    </Tabs>
  </section>
</template>
