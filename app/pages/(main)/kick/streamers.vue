<script setup lang="ts">
const draft = ref<
  (KickStreamer & { status: "saved" | "pending" | "removed" })[]
>([]);
const kickStore = useKickStore();
const { streamers } = storeToRefs(kickStore);
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
        "get_kick_streamers",
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
  <section class="space-y-4">
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
        <Input disabled :model-value="item.channel.slug" class="opacity-100!" />
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
  </section>
</template>
