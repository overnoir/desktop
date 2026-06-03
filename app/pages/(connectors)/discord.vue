<script setup lang="ts">
const discordStateStore = useDiscordStateStore();
const { errors, connected } = storeToRefs(discordStateStore);
const discordSettingsStore = useDiscordSettingsStore();
const { discordSettings } = storeToRefs(discordSettingsStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();
const loading = ref(false);

async function resetDiscordSettings() {
  discordSettingsStore.reset();
  $toast(t("discord.reset.success"));
}

async function toggleConnection(value: boolean) {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 100));
  try {
    if (value) {
      await tauriCoreInvoke("connect_discord");
      connected.value = true;
    } else {
      await tauriCoreInvoke("close_discord");
      connected.value = false;
    }
  } catch (error) {
    discordStateStore.addError(JSON.stringify(error));
  }
  loading.value = false;
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:gap-4 [&>div]:justify-between"
  >
    <template v-if="errors.length">
      <div class="flex-col gap-2! max-h-51.5 overflow-auto">
        <Alert
          v-for="{ createdAt, id, message } in errors"
          :key="id"
          variant="destructive"
        >
          <Icon name="lucide:alert-triangle" />
          <AlertTitle>
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
      <div>
        <h1 class="text-sm">{{ $t("discord.isEnabled.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.isEnabled.description") }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Switch
          v-model="discordSettings.isEnabled"
          class="justify-self-end shrink-0"
          @update:model-value="toggleConnection"
        />
      </div>
    </div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.connection.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.connection.description") }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Badge class="h-5.25 gap-1.5" variant="outline">
          <Spinner v-if="loading" />
          <template v-else>
            <div
              class="size-2 rounded-full"
              :class="{
                'bg-green-500': connected,
                'bg-red-500': !connected,
              }"
            />
            {{ $t(`discord.connection.${connected ? "connected" : "closed"}`) }}
          </template>
        </Badge>
        <Button
          v-if="!connected && discordSettings.isEnabled && !loading"
          variant="outline"
          size="icon-sm"
          @click="toggleConnection(true)"
        >
          <Icon name="lucide:refresh-ccw" />
        </Button>
      </div>
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
