<script setup lang="ts">
const draft = ref<
  (KickChannel & { status: "saved" | "pending" | "removed" })[]
>([]);
const kickStore = useKickStore();
const { settings, channels } = storeToRefs(kickStore);
const { handleSubmit, resetForm } = useForm({
  validationSchema: kickAddChannelSchema,
});
const errorsStore = useErrorsStore();
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

const onSubmit = handleSubmit(async ({ slug }) => {
  if (draft.value.some((channel) => channel.slug === slug)) {
    $toast.error(t("kick.addChannel.alreadyAdded"));
    return;
  }
  draft.value.push({ slug, id: 0, status: "pending", profilePicture: "" });
  resetForm();
});

async function save() {
  loading.value = true;
  try {
    const newSlugs = draft.value
      .filter(({ status, id }) => status === "pending" && id === 0)
      .map(({ slug }) => slug);

    if (newSlugs.length) {
      let channelsData: KickChannel[];
      try {
        channelsData = await tauriCoreInvoke<KickChannelsResponse>(
          "api_fetch_kick_channels",
          { slugs: newSlugs },
        );
      } catch (error) {
        errorsStore.addError(JSON.stringify(error));
        draft.value = draft.value.filter(
          (item) => !(item.status === "pending" && item.id === 0),
        );
        channelsData = [];
      }

      for (const item of draft.value) {
        if (item.status === "pending" && item.id === 0) {
          const match = channelsData.find(({ slug }) => slug === item.slug);
          if (match) {
            item.profilePicture = match.profilePicture;
            item.id = match.id;
          }
        }
      }

      draft.value = draft.value.filter(
        (item) => !(item.status === "pending" && item.id === 0),
      );

      const newIds = channelsData.map(({ id }) => id);

      if (newIds.length) {
        try {
          const data = await tauriCoreInvoke<KickLivestreamsResponse>(
            "api_fetch_kick_livestreams",
            { ids: newIds },
          );
          for (const item of draft.value) {
            if (item.status === "pending") {
              const match = data.find((s) => s.slug === item.slug);
              item.livestream = match
                ? { category: match.category }
                : undefined;
            }
          }
        } catch (error) {
          errorsStore.addError(JSON.stringify(error));
          const newSlugsSet = new Set(newSlugs);
          draft.value = draft.value.filter(
            (item) =>
              !(item.status === "pending" && newSlugsSet.has(item.slug)),
          );
        }
      }
    }

    const removedSlugs = draft.value
      .filter(({ status }) => status === "removed")
      .map(({ slug }) => slug);

    for (const item of draft.value) {
      if (removedSlugs.includes(item.slug)) {
        item.livestream = undefined;
      }
    }

    const saved = draft.value.filter(({ status }) => status !== "removed");

    channels.value = saved.map(({ status: _, ...rest }) => rest);
    draft.value = saved.map((channel) => ({ ...channel, status: "saved" }));

    await kickStore.$tauri.saveAllNow();

    $toast.success(t("kick.addChannel.success"));
  } catch (error) {
    errorsStore.addError(JSON.stringify(error));
    $toast.error(t("kick.addChannel.error"));
  }
  loading.value = false;
}

onNuxtReady(() => {
  draft.value = channels.value.map((channel) => ({
    ...channel,
    status: "saved",
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
            :key="item.slug"
            :class="{
              'opacity-40': item.status === 'removed',
            }"
            class="flex gap-2 items-center"
          >
            <NuxtImg
              v-if="item.profilePicture"
              class="shrink-0 size-9 bg-secondary rounded-lg border"
              :src="item.profilePicture"
              alt="Profile Picture"
            />
            <div
              v-else
              class="shrink-0 size-9 bg-secondary rounded-lg border grid place-items-center"
            >
              <Icon name="lucide:user" />
            </div>
            <Input disabled :model-value="item.slug" class="opacity-100!" />
            <Button
              variant="secondary"
              size="icon"
              @click="
                item.status =
                  item.status === 'removed'
                    ? item.id
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
