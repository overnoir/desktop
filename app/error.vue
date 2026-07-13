<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();

const { currentWebviewWindow, listenDrag, onDragStart } =
  useWebviewWindow().getCurrent();
const { general } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();
const { logError } = useLogs();

await logError({ error, source: LogSource.Unknow });
await setLocale(general.value.locale);
listenDrag();

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
        <LayoutTitlebar @destroy="destroy" @mousedown="onDragStart" />
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
