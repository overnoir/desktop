<script setup lang="ts">
import type { CSSProperties } from "vue";

const { general, advanced } = storeToRefs(useSettingsStore());
const { getCurrent, getByLabel } = useWebviewWindow();
const { currentWebviewWindow, isDragging } = getCurrent();
const { logError } = useLogs();
const { create } = useTray();
const anchor = shallowRef<{
  centerX: number;
  centerY: number;
  bottom: number;
  right: number;
} | null>(null);

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
    minHeight: `${general.value.size}px`,
    minWidth: `${general.value.size}px`,
    border: "1px solid var(--border)",
  };
});

const htmlStyles = computed<CSSProperties>(() => ({
  opacity: `${general.value.opacity}%`,
}));

try {
  if (advanced.value.autoStart !== (await tauriAutoStartIsEnabled())) {
    if (advanced.value.autoStart) {
      await tauriAutoStartEnable();
    } else {
      await tauriAutoStartDisable();
    }
  }
} catch (error) {
  await logError({ error, source: LogSource.App });
}

onMounted(async () => {
  try {
    const [, updaterWebviewWindow] = await Promise.all([
      Promise.all([
        currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop),
        currentWebviewWindow.setIgnoreCursorEvents(advanced.value.ignoreCursor),
        currentWebviewWindow.onMoved(({ payload }) => {
          if (!isDragging.value) {
            return;
          }
          general.value.x = payload.x;
          general.value.y = payload.y;
          anchor.value = null;
        }),
        currentWebviewWindow.setPosition(
          new TauriDpiLogicalPosition(general.value.x, general.value.y),
        ),
      ]),
      getByLabel({
        label: WebviewWindowLabel.Updater,
        isNSPanel: false,
      }),
    ]);

    if (updaterWebviewWindow) {
      await updaterWebviewWindow.destroy();
    }

    await currentWebviewWindow.show();
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }

  try {
    await create();
  } catch (error) {
    await logError({ error, source: LogSource.Tray });
  }

  useResizeObserver(document.body, async (entries) => {
    try {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;

      const [currentPosition, currentSize] = await Promise.all([
        currentWebviewWindow.outerPosition(),
        currentWebviewWindow.outerSize(),
      ]);

      if (anchor.value === null) {
        anchor.value = {
          centerY: currentPosition.y + currentSize.height / 2,
          centerX: currentPosition.x + currentSize.width / 2,
          bottom: currentPosition.y + currentSize.height,
          right: currentPosition.x + currentSize.width,
        };
      }

      let newX = general.value.x;
      let newY = general.value.y;

      if (general.value.orientation === Orientation.Vertical) {
        if (general.value.alignment === Alignment.Center) {
          newY = Math.round(anchor.value.centerY - height / 2);
        } else if (general.value.alignment === Alignment.Right) {
          newY = Math.round(anchor.value.bottom - height);
        }
      } else {
        if (general.value.alignment === Alignment.Center) {
          newX = Math.round(anchor.value.centerX - width / 2);
        } else if (general.value.alignment === Alignment.Right) {
          newX = Math.round(anchor.value.right - width);
        }
      }

      if (!isDragging.value) {
        await currentWebviewWindow.setPosition(
          new TauriDpiLogicalPosition(newX, newY),
        );
      }

      await currentWebviewWindow.setSize(
        new TauriDpiLogicalSize(width, height),
      );
    } catch (error) {
      await logError({ error, source: LogSource.WebviewWindow });
    }
  });
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
