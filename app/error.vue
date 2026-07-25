<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();

const currentWebviewWindow = useWebviewWindow().getCurrent();
const { general } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();
const { logError } = useLogs();

await Promise.all([
  logError({ error, source: LogSource.Unknown }),
  setLocale(general.value.locale),
]);

async function destroy() {
  try {
    await currentWebviewWindow.destroy();
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
        <LayoutTitlebar @destroy="destroy" />
        <main class="h-screen overflow-auto grid place-items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon name="lucide:triangle-alert" />
              </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>{{ error }}</EmptyTitle>
            <EmptyContent>
              <Button @click="clearError">
                {{ $t("error.clear") }}
              </Button>
            </EmptyContent>
          </Empty>
        </main>
      </div>
    </Body>
  </Html>
</template>
