<script setup lang="ts">
const { connectedUser, isConnected, clientId } = storeToRefs(useDiscordStore());
const deleteVaultItemsOnDisconnect = shallowRef(true);
const { connect, disconnect } = useDiscord();
const { $toast } = useNuxtApp();
const { logError } = useLogs();
const loading = shallowRef(false);
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
  const action = isConnected.value ? "disconnect" : "connect";
  try {
    if (action === "connect") {
      connectedUser.value = await connect();
      isConnected.value = true;
    } else {
      await disconnect({
        deleteVaultItems: deleteVaultItemsOnDisconnect.value,
      });
      deleteVaultItemsOnDisconnect.value = true;
      connectedUser.value = null;
      isConnected.value = false;
    }

    $toast.success(t(`discord.${action}.success`));
  } catch (error) {
    $toast.error(error instanceof Error ? error.message : String(error));
    await logError({ error, source: LogSource.Discord });
  }
  loading.value = false;
}
</script>

<template>
  <section>
    <Card class="border-0">
      <CardHeader class="text-center">
        <CardTitle>Discord RPC</CardTitle>
        <CardDescription>
          <template v-if="isConnected">
            {{
              $t("discord.disconnect.description", {
                username: connectedUser?.username,
              })
            }}
          </template>
          <template v-else>{{ $t("discord.connect.description") }} </template>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <template v-if="isConnected">
          <div class="flex flex-col items-center gap-4">
            <NuxtImg
              v-if="avatarUrl"
              class="size-24 rounded-lg border"
              :src="avatarUrl"
              alt="Avatar"
            />
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="secondary" size="lg">
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
                  <Label for="delete-vault-items">
                    {{ $t("discord.disconnect.dialog.deleteVaultItems") }}
                  </Label>
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
          </div>
        </template>
        <template v-else>
          <div class="space-y-4">
            <div class="space-y-2">
              <ClientOnly>
                <Input
                  v-model="clientId"
                  :placeholder="$t('discord.connect.clientId.placeholder')"
                  class="text-center"
                />
              </ClientOnly>
              <Button variant="link" class="h-max p-0">
                {{ $t("discord.connect.clientId.description") }}
              </Button>
            </div>
            <Button
              class="bg-[#5865F2] hover:bg-[#5865F2]/90! w-full"
              variant="ghost"
              :disabled="!clientId"
              :loading
              size="lg"
              @click="toggleConnection"
            >
              {{ $t("discord.connect.button") }}
            </Button>
          </div>
        </template>
      </CardContent>
    </Card>
  </section>
</template>
