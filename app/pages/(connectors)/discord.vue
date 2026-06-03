<script setup lang="ts">
const discordSettingsStore = useDiscordSettingsStore();
const { discordSettings } = storeToRefs(discordSettingsStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();

async function resetDiscordSettings() {
  discordSettingsStore.reset();
  $toast(t("discord.reset.success"));
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-between"
  >
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.isEnabled.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.isEnabled.description") }}
        </p>
      </div>
      <Switch
        v-model="discordSettings.isEnabled"
        class="justify-self-end shrink-0"
      />
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
