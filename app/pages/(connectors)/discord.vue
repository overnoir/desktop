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
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:gap-4 [&>div]:justify-between"
  >
    <template v-if="discordState.errors.length">
      <div>
        <div>
          <h1 class="text-sm">{{ $t("discord.errors.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("discord.errors.description") }}
          </p>
        </div>
        <Button
          class="justify-self-end shrink-0"
          variant="destructive"
          @click="discordStateStore.clearErrors"
        >
          {{ $t("discord.errors.clear") }}
        </Button>
      </div>
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
    <div>
      <Card class="w-full p-4 gap-4">
        <CardHeader class="flex items-start p-0 gap-4">
          <div>
            <div
              class="bg-[#5865F2] size-10 rounded-lg grid place-items-center"
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
          class="bg-[#5865F2] hover:bg-[#5865F2]/90"
          :loading
          :variant="discordState.connected ? 'outline' : 'default'"
          @click="toggleConnection"
        >
          {{
            $t(
              `discord.connection.${discordState.connected ? "disconnect" : "connect"}.button`,
            )
          }}
        </Button>
      </Card>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.showMe.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.showMe.description") }}
        </p>
      </div>
      <Switch
        v-model="discordSettings.showMe"
        class="justify-self-end shrink-0"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.showOnlySpeakers.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.showOnlySpeakers.description") }}
        </p>
      </div>
      <Switch
        v-model="discordSettings.showOnlySpeakers"
        class="justify-self-end shrink-0"
      />
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.reset.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.reset.description") }}
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive" class="justify-self-end shrink-0">
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
    </div>
  </section>
</template>
