<script setup lang="ts">
const draft = ref<
  (KickStreamer & { status: "saved" | "pending" | "removed" })[]
>([]);
const kickStore = useKickStore();
const { settings, streamers, streams } = storeToRefs(kickStore);
const { handleSubmit, resetForm } = useForm({
  validationSchema: kickAddStreamerSchema,
});
const { fetchKickStreamers, fetchKickStreams } = useApi();
const errorsStore = useErrorsStore();
const { $toast } = useNuxtApp();
const loading = ref(false);
const { t } = useI18n();

const onSubmit = handleSubmit(async ({ slug }) => {
  if (draft.value.some((streamer) => streamer.slug === slug)) {
    $toast.error(t("kick.addStreamer.alreadyAdded"));
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
      const { data } = await fetchKickStreamers(newSlugs);
      for (const item of draft.value) {
        if (item.status === "pending" && item.id === 0) {
          const match = data.value?.find(({ slug }) => slug === item.slug);
          if (match) {
            item.profilePicture = match.profilePicture;
            item.id = match.id;
          }
        }
      }

      draft.value = draft.value.filter(
        (item) => !(item.status === "pending" && item.id === 0),
      );

      const newIds = data.value?.map(({ id }) => id) || [];

      if (newIds.length) {
        const { data } = await fetchKickStreams(newIds);
        const newStreams = data.value || [];
        streams.value = [
          ...(streams.value || []).filter(
            (stream) => !newStreams.some(({ slug }) => slug === stream.slug),
          ),
          ...newStreams,
        ];
      }
    }

    const removedSlugs = draft.value
      .filter(({ status }) => status === "removed")
      .map(({ slug }) => slug);

    const saved = draft.value.filter(({ status }) => status !== "removed");

    streamers.value = saved.map(({ status: _, ...rest }) => rest);
    draft.value = saved.map((streamer) => ({ ...streamer, status: "saved" }));

    if (removedSlugs.length && streams.value) {
      streams.value = streams.value.filter(
        (s) => !removedSlugs.includes(s.slug),
      );
    }

    await kickStore.$tauri.saveAllNow();

    $toast.success(t("kick.addStreamer.success"));
  } catch (error) {
    errorsStore.addError(JSON.stringify(error));
    $toast.error(t("kick.addStreamer.error"));
  }
  loading.value = false;
}

onNuxtReady(() => {
  draft.value = streamers.value.map((streamer) => ({
    ...streamer,
    status: "saved",
  }));
});
</script>

<template>
  <section class="space-y-4 max-w-3xl mx-auto">
    <Tabs
      class="flex-row gap-6 [&>div]:not-first:space-y-4"
      default-value="streamers"
    >
      <TabsList
        class="flex-col h-max sticky top-10.75 [&>button]:gap-3 [&>button]:w-40 [&>button]:justify-start"
      >
        <TabsTrigger value="streamers">
          <Icon name="lucide:radio" />
          {{ $t("kick.tabs.0") }}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon name="lucide:sliders-horizontal" />
          {{ $t("kick.tabs.1") }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="streamers" class="space-y-4">
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
                    :placeholder="$t('kick.addStreamer.placeholder')"
                    :aria-invalid="!!errors.length"
                    autocapitalize="off"
                    autocorrect="off"
                    type="text"
                    v-bind="field"
                  />
                  <Button type="submit" size="icon" :disabled="loading">
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
            {{ $t("kick.addStreamer.save") }}
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
