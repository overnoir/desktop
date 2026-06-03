<script setup lang="ts">
const discordStore = useDiscordStore();
const { discord } = storeToRefs(discordStore);
const { $toast } = useNuxtApp();
const { t } = useI18n();

async function resetDiscord() {
  discordStore.reset();
  $toast(t("discord.reset.success"));
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-between"
  >
    <div><Switch v-model="discord.isEnabled" /></div>
    <Separator />
    <div>
      <div>
        <h1 class="text-sm">{{ $t("discord.showMe.title") }}</h1>
        <p class="text-muted-foreground text-xs">
          {{ $t("discord.showMe.description") }}
        </p>
      </div>
      <Switch v-model="discord.showMe" class="justify-self-end shrink-0" />
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
        v-model="discord.showOnlySpeakers"
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
            <AlertDialogAction variant="destructive" @click="resetDiscord">
              {{ $t("discord.reset.dialog.confirm") }}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </section>
</template>
