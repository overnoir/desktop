<script setup lang="ts">
import type { CSSProperties } from "vue";

const lastPosition = shallowRef<{ x: number; y: number } | null>(null);
const { general, advanced } = storeToRefs(useSettingsStore());
const { getCurrent, getByLabel } = useWebviewWindow();
const currentWebviewWindow = getCurrent();
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
  await logError({ source: LogSource.App, error });
}

onMounted(async () => {
  try {
    lastPosition.value = { x: general.value.x, y: general.value.y };

    const [, updaterWebviewWindow] = await Promise.all([
      Promise.all([
        currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop),
        currentWebviewWindow.setIgnoreCursorEvents(
          advanced.value.ignoreCursorEvents,
        ),
        currentWebviewWindow.onMoved(({ payload }) => {
          general.value.x = payload.x;
          general.value.y = payload.y;
          if (
            lastPosition.value &&
            payload.x === lastPosition.value.x &&
            payload.y === lastPosition.value.y
          ) {
            lastPosition.value = null;
          } else {
            anchor.value = null;
          }
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
    await logError({ source: LogSource.WebviewWindow, error });
  }

  try {
    await create();
  } catch (error) {
    await logError({ source: LogSource.Tray, error });
  }

  useResizeObserver(document.body, async (entries) => {
    try {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;

      if (anchor.value === null) {
        anchor.value = {
          centerY: general.value.y + height / 2,
          centerX: general.value.x + width / 2,
          bottom: general.value.y + height,
          right: general.value.x + width,
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

      await currentWebviewWindow.setSize(
        new TauriDpiLogicalSize(width, height),
      );

      lastPosition.value = { x: newX, y: newY };
      await currentWebviewWindow.setPosition(
        new TauriDpiLogicalPosition(newX, newY),
      );
    } catch (error) {
      await logError({ source: LogSource.WebviewWindow, error });
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
