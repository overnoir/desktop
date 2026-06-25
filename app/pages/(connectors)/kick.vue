<script setup lang="ts">
const { handleSubmit } = useForm({
  validationSchema: kickAddStreamerSchema,
});

const kickStore = useKickStore();
const { settings } = storeToRefs(kickStore);
const slugs = ref<string[]>([]);
const { t } = useI18n();

const onSubmit = handleSubmit(async (values) => {
  slugs.value.push(values.slug);
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
            <VeeField v-slot="{ field, errors }" name="slug">
              <Field :data-invalid="!!errors.length">
                <div class="flex items-center gap-2">
                  <Input
                    :placeholder="$t('kick.slug.placeholder')"
                    :aria-invalid="!!errors.length"
                    v-bind="field"
                  />
                  <Button type="submit" size="icon">
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
        <template v-if="slugs.length">
          <div
            v-for="(slug, i) in slugs"
            :key="i"
            class="flex gap-2 items-center"
          >
            <Input disabled :model-value="slug" class="opacity-100!" />
            <Button
              size="icon"
              variant="secondary"
              @click="slugs = slugs.filter((value) => value !== slug)"
            >
              <Icon name="lucide:x" />
            </Button>
          </div>
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
