<script setup lang="ts">
const errorsStore = useErrorsStore();
const { errors } = storeToRefs(errorsStore);
</script>

<template>
  <section class="space-y-4 max-w-3xl mx-auto">
    <template v-if="errors.length">
      <SettingField
        :title="`${$t('errors.title')} (${errors.length})`"
        :description="$t('errors.description')"
      >
        <Button variant="destructive" @click="errorsStore.clearErrors">
          {{ $t("errors.clear") }}
        </Button>
      </SettingField>
      <Separator />
      <div class="flex flex-col gap-2">
        <Alert
          v-for="{ createdAt, id, message, source } in errors"
          :key="id"
          variant="destructive"
        >
          <AlertTitle class="line-clamp-none">
            <div class="flex justify-between items-start gap-4">
              <p>{{ message }}</p>
              <Button
                variant="secondary"
                class="size-5 shrink-0"
                size="icon"
                @click="errorsStore.removeError(id)"
              >
                <Icon name="lucide:x" />
              </Button>
            </div>
          </AlertTitle>
          <AlertDescription
            class="text-xs text-secondary-foreground text-nowrap"
          >
            {{ new Date(createdAt).toLocaleString() }}
            <span v-if="source" class="uppercase">[{{ source }}]</span>
          </AlertDescription>
        </Alert>
      </div>
    </template>
    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="lucide:thumbs-up" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>{{ $t("errors.empty.title") }}</EmptyTitle>
      <EmptyDescription>
        {{ $t("errors.empty.description") }}
      </EmptyDescription>
    </Empty>
  </section>
</template>
