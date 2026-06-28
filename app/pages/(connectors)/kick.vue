<script setup lang="ts">
const draft = ref<
  (KickStreamer & { status: "saved" | "pending" | "removed" })[]
>([]);
const kickStore = useKickStore();
const { settings, streamers } = storeToRefs(kickStore);
const { handleSubmit, resetForm } = useForm({
  validationSchema: kickAddChannelSchema,
});
const errorsStore = useErrorsStore();
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

const onSubmit = handleSubmit(async ({ slug }) => {
  if (draft.value.some(({ channel }) => channel.slug === slug)) {
    $toast.error(t("kick.addChannel.alreadyAdded"));
    return;
  }
  draft.value.push({
    channel: { stream: { isLive: false }, category: { name: "" }, slug },
    user: { profilePicture: "", name: "", id: 0 },
    status: "pending",
  });
  resetForm();
});

async function save() {
  loading.value = true;
  try {
    let newDraft = [...draft.value];

    newDraft = newDraft.filter(({ status }) => status !== "removed");

    const newSlugs = newDraft
      .filter(({ status }) => status === "pending")
      .map(({ channel }) => channel.slug);

    if (newSlugs.length) {
      const streamersData = await tauriCoreInvoke<KickStreamer[]>(
        "api_get_kick_streamers",
        { slugs: newSlugs },
      );

      for (const item of newDraft) {
        if (item.status === "pending") {
          const streamer = streamersData.find(
            ({ channel }) => channel.slug === item.channel.slug,
          );
          if (streamer) {
            item.channel = streamer.channel;
            item.user = streamer.user;
            item.status = "saved";
          } else {
            newDraft = newDraft.filter(
              ({ channel }) => channel.slug !== item.channel.slug,
            );
          }
        }
      }
    }

    streamers.value = newDraft.map(({ status, ...rest }) => rest);
    draft.value = newDraft;

    await kickStore.$tauri.saveAllNow();

    $toast.success(t("kick.addChannel.success"));
  } catch (error) {
    errorsStore.addError({
      message: JSON.stringify(error),
      source: ErrorSource.Kick,
    });
    $toast.error(t("kick.addChannel.error"));
  }
  loading.value = false;
}

onNuxtReady(() => {
  draft.value = streamers.value.map((streamer) => ({
    status: "saved",
    ...streamer,
  }));
});
</script>

<template>
  <section class="space-y-4 max-w-3xl mx-auto">
    <Tabs
      class="flex-row gap-6 [&>div]:not-first:space-y-4"
      default-value="channels"
    >
      <TabsList
        class="flex-col h-max sticky top-10.75 [&>button]:gap-3 [&>button]:w-40 [&>button]:justify-start"
      >
        <TabsTrigger value="channels">
          <Icon name="lucide:radio" />
          {{ $t("kick.tabs.0") }}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon name="lucide:sliders-horizontal" />
          {{ $t("kick.tabs.1") }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="channels" class="space-y-4">
        <form @submit="onSubmit">
          <FieldGroup>
            <VeeField
              v-slot="{ field, errors }"
              name="slug"
              :validate-on-blur="false"
            >
              <Field :data-invalid="!!errors.length">
                <div class="flex items-center gap-2">
                  <Input
                    :placeholder="$t('kick.addChannel.placeholder')"
                    :aria-invalid="!!errors.length"
                    :disabled="draft.length >= 10"
                    autocapitalize="off"
                    autocorrect="off"
                    type="text"
                    v-bind="field"
                  />
                  <Button
                    :disabled="loading || draft.length >= 10"
                    type="submit"
                    size="icon"
                  >
                    <Icon name="lucide:plus" />
                  </Button>
                </div>
                <FieldError
                  v-if="errors.length"
                  :errors="errors.map((e) => $t(e))"
                />
              </Field>
            </VeeField>
          </FieldGroup>
        </form>
        <template v-if="draft.length">
          <div
            v-for="item in draft"
            :key="item.channel.slug"
            :class="{
              'opacity-40': item.status === 'removed',
            }"
            class="flex gap-2 items-center"
          >
            <NuxtImg
              v-if="item.user.profilePicture"
              class="shrink-0 size-9 bg-secondary rounded-lg border"
              :src="item.user.profilePicture"
              alt="Profile Picture"
            />
            <div
              v-else
              class="shrink-0 size-9 bg-secondary rounded-lg border grid place-items-center"
            >
              <Icon name="lucide:user" />
            </div>
            <Input
              disabled
              :model-value="item.channel.slug"
              class="opacity-100!"
            />
            <Button
              variant="secondary"
              size="icon"
              @click="
                item.status =
                  item.status === 'removed'
                    ? item.user.id
                      ? 'saved'
                      : 'pending'
                    : 'removed'
              "
            >
              <Icon
                :name="item.status === 'removed' ? 'lucide:undo-2' : 'lucide:x'"
              />
            </Button>
          </div>
          <Button
            v-if="draft.some((s) => s.status !== 'saved')"
            class="float-end"
            :loading
            @click="save"
          >
            {{ $t("kick.addChannel.save") }}
          </Button>
        </template>
        <Empty v-else>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon name="lucide:ghost" />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyTitle>{{ $t("kick.empty.title") }}</EmptyTitle>
          <EmptyDescription>
            {{ $t("kick.empty.description") }}
          </EmptyDescription>
        </Empty>
      </TabsContent>
      <TabsContent value="settings">
        <SettingField
          :description="$t('kick.showOnlyLive.description')"
          :title="$t('kick.showOnlyLive.title')"
        >
          <Switch v-model="settings.showOnlyLive" />
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('kick.showSlug.description')"
          :title="$t('kick.showSlug.title')"
        >
          <Select v-model="settings.showSlug">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="show in Object.values(KickShow)"
                :key="show"
                :value="show"
              >
                {{ $t(`kick.show.${show}`) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('kick.showCategory.description')"
          :title="$t('kick.showCategory.title')"
        >
          <Select v-model="settings.showCategory">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="show in Object.values([
                  KickShow.WhileLive,
                  KickShow.Never,
                ])"
                :key="show"
                :value="show"
              >
                {{ $t(`kick.show.${show}`) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('kick.channelLimit.description')"
          :title="$t('kick.channelLimit.title')"
        >
          <div class="flex flex-col">
            <NumberField v-model="settings.channelLimit" :max="50" :min="0">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput class="rounded-b-none border-b-0" />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <Slider
              class="*:data-[slot='slider-track']:rounded-t-none"
              :model-value="[settings.channelLimit]"
              :max="10"
              :min="0"
              @update:model-value="settings.channelLimit = $event![0]!"
            />
          </div>
        </SettingField>
        <Separator />
        <SettingField
          :description="$t('kick.reset.description')"
          :title="$t('kick.reset.title')"
        >
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive">
                {{ $t("kick.reset.title") }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {{ $t("kick.reset.dialog.title") }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {{ $t("kick.reset.dialog.description") }}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t("kick.reset.dialog.cancel") }}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  @click="
                    kickStore.resetSettings();
                    $toast.success(t('kick.reset.success'));
                  "
                >
                  {{ $t("kick.reset.dialog.confirm") }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingField>
      </TabsContent>
    </Tabs>
  </section>
</template>
