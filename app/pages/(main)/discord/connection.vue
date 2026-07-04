<script setup lang="ts">
const discordStore = useDiscordStore();
const { connectedUser } = storeToRefs(discordStore);
const deleteVaultItemsOnDisconnect = ref(true);
const errorsStore = useErrorsStore();
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
        await discordStore.$tauri.saveAllNow();
      }
      deleteVaultItemsOnDisconnect.value = true;
      connectedUser.value = null;
    }

    $toast.success(t(`discord.${action}.success`));
  } catch (error) {
    errorsStore.addError({
      message: JSON.stringify(error),
      source: ErrorSource.Discord,
    });
    $toast.error(JSON.stringify(error));
  }
  loading.value = false;
}
</script>

<template>
  <section>
    <Card class="text-center border-0">
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
  </section>
</template>
