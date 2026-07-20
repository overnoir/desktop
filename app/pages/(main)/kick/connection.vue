<script setup lang="ts">
const draft = ref<
  (KickStreamer & { status: "saved" | "pending" | "removed" })[]
>([]);
const kickStore = useKickStore();
const { streamers } = storeToRefs(kickStore);
const { handleSubmit, resetForm } = useForm({
  validationSchema: kickAddStreamerSchema,
});
const { getStreamers } = useKick();
const { $toast } = useNuxtApp();
const { logError } = useLogs();
const loading = shallowRef(false);
const { t } = useI18n();

const onSubmit = handleSubmit(async ({ slug }) => {
  if (draft.value.some((streamer) => streamer.slug === slug)) {
    $toast.error(t("kick.addStreamer.alreadyAdded"));
    return;
  }

  draft.value.push({
    profilePicture: "",
    status: "pending",
    name: "",
    id: 0,
    slug,
    stream: {
      isLive: false,
      category: "",
    },
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
      .map(({ slug }) => slug);

    if (newSlugs.length) {
      const streamersData = await getStreamers({ slugs: newSlugs });

      for (const item of newDraft) {
        if (item.status === "pending") {
          const streamer = streamersData.find(({ slug }) => slug === item.slug);
          if (streamer) {
            Object.assign(item, streamer, { status: "saved" });
          } else {
            newDraft = newDraft.filter(({ slug }) => slug !== item.slug);
          }
        }
      }
    }

    streamers.value = newDraft.map(({ status, ...rest }) => rest);
    draft.value = newDraft;

    await kickStore.$tauri.saveAllNow();

    $toast.success(t("kick.addStreamer.success"));
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ error, source: LogSource.Kick });
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
  <section class="space-y-4">
    <form @submit="onSubmit">
      <FieldGroup>
        <VeeField
          v-slot="{ field, errors }"
          :validate-on-blur="false"
          name="slug"
        >
          <Field :data-invalid="!!errors.length">
            <div class="flex items-center gap-2">
              <Input
                :placeholder="$t('kick.addStreamer.placeholder')"
                :aria-invalid="!!errors.length"
                :disabled="draft.length >= MAX_KICK_STREAMER_COUNT"
                autocapitalize="off"
                autocorrect="off"
                type="text"
                v-bind="field"
              />
              <Button
                :disabled="loading || draft.length >= MAX_KICK_STREAMER_COUNT"
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
  </section>
</template>
