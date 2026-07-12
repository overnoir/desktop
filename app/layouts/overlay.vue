<script setup lang="ts">
import type { CSSProperties } from "vue";

const { general, advanced } = storeToRefs(useSettingsStore());
const { getCurrent, getByLabel } = useWebviewWindow();
const { currentWebviewWindow, isDragging } = getCurrent();
const errorsStore = useErrorsStore();
const { create } = useTray();

const backgroundStyles = computed<CSSProperties>(() => {
  if (!general.value.showBackground) {
    return {
      minHeight: "1px",
      minWidth: "1px",
    };
  }

  return {
    borderRadius: `${Math.round(((general.value.size * general.value.radius) / 200) * 1.15)}px`,
    padding: `${Math.round(general.value.size / 25)}px`,
    backgroundColor: "var(--background)",
    border: "1px solid var(--border)",
  };
});

const htmlStyles = computed<CSSProperties>(() => ({
  opacity: `${general.value.opacity}%`,
}));

await tauriEventListen<Pick<AppError, "message" | "source">>(
  "error",
  ({ payload }) => {
    errorsStore.addError({ message: payload.message, source: payload.source });
  },
);

if (advanced.value.autoStart !== (await tauriAutoStartIsEnabled())) {
  if (advanced.value.autoStart) {
    await tauriAutoStartEnable();
  } else {
    await tauriAutoStartDisable();
  }
}

onMounted(async () => {
  await currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
  await currentWebviewWindow.setIgnoreCursorEvents(advanced.value.ignoreCursor);
  await currentWebviewWindow.onMoved(({ payload }) => {
    if (!isDragging.value) {
      return;
    }
    general.value.x = payload.x;
    general.value.y = payload.y;
  });

  await currentWebviewWindow.setPosition(
    new TauriDpiLogicalPosition(general.value.x, general.value.y),
  );

  useResizeObserver(document.body, async (entries) => {
    const entry = entries[0];

    if (!entry) {
      return;
    }

    const { width, height } = entry.contentRect;

    const [currentPosition, currentSize] = await Promise.all([
      currentWebviewWindow.outerPosition(),
      currentWebviewWindow.outerSize(),
    ]);

    const deltaX = width - currentSize.width;
    const deltaY = height - currentSize.height;

    let newX = currentPosition.x;
    let newY = currentPosition.y;

    if (general.value.orientation === Orientation.Vertical) {
      if (general.value.alignment === "center") {
        newY = currentPosition.y - deltaY / 2;
      } else if (general.value.alignment === "right") {
        newY = currentPosition.y - deltaY;
      }
    } else {
      if (general.value.alignment === "center") {
        newX = currentPosition.x - deltaX / 2;
      } else if (general.value.alignment === "right") {
        newX = currentPosition.x - deltaX;
      }
    }

    if (!isDragging.value) {
      await currentWebviewWindow.setPosition(
        new TauriDpiLogicalPosition(newX, newY),
      );
    }

    await currentWebviewWindow.setSize(new TauriDpiLogicalSize(width, height));
  });

  const updaterWebviewWindow = await getByLabel({
    label: WebviewWindowLabel.Updater,
    isNSPanel: false,
  });

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
  }

  await create();

  await currentWebviewWindow.show();
});
</script>

<template>
  <Html :style="htmlStyles" class="rounded-none">
    <Body
      class="size-max **:select-none **:transition-none bg-transparent rounded-none"
    >
      <main :style="backgroundStyles">
        <slot />
      </main>
    </Body>
  </Html>
</template>
