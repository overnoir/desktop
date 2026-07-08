<script setup lang="ts">
import type { CSSProperties } from "vue";

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { general, advanced } = storeToRefs(useSettingsStore());
const { isDragging } = useWebviewWindowDrag();
const isMacOS = tauriOSType() === "macos";
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
  if (isMacOS) {
    await tauriCoreInvoke("set_nspanel_ignore_cursor", {
      value: advanced.value.ignoreCursor,
      label: WebviewWindowLabel.Overlay,
    });
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      value: advanced.value.alwaysOnTop,
      label: WebviewWindowLabel.Overlay,
    });
    await tauriEventListen("nspanel-moved", async () => {
      if (!isDragging.value) {
        return;
      }
      const { x, y } = await overlayWebviewWindow.outerPosition();
      general.value.x = x;
      general.value.y = y;
    });
  } else {
    await overlayWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
    await overlayWebviewWindow.setIgnoreCursorEvents(
      advanced.value.ignoreCursor,
    );
    await overlayWebviewWindow.onMoved(({ payload }) => {
      if (!isDragging.value) {
        return;
      }
      const { x, y } = payload;
      general.value.x = x;
      general.value.y = y;
    });
  }

  await overlayWebviewWindow.setPosition(
    new TauriDpiLogicalPosition(general.value.x, general.value.y),
  );

  useResizeObserver(document.body, async (entries) => {
    const entry = entries[0];

    if (!entry) {
      return;
    }

    const { width, height } = entry.contentRect;

    const [currentPosition, currentSize] = await Promise.all([
      overlayWebviewWindow.outerPosition(),
      overlayWebviewWindow.outerSize(),
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
      await overlayWebviewWindow.setPosition(
        new TauriDpiLogicalPosition(newX, newY),
      );
    }

    await overlayWebviewWindow.setSize(new TauriDpiLogicalSize(width, height));
  });

  const updaterWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
    WebviewWindowLabel.Updater,
  );

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
  }

  await create();

  await overlayWebviewWindow.show();
});
</script>

<template>
  <Html :style="htmlStyles">
    <Body class="size-max **:select-none **:transition-none bg-transparent">
      <main :style="backgroundStyles">
        <slot />
      </main>
    </Body>
  </Html>
</template>
