<script setup lang="ts">
const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { general, advanced } = storeToRefs(useSettingsStore());
const isDragging = useState("is-dragging", () => false);
const { htmlStyles, backgroundStyles } = useStyles();
const isMacOS = tauriOSType() === "macos";
const errorsStore = useErrorsStore();
const { create } = useTray();

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
  const updaterWebviewWindow = (
    await tauriWebviewWindowGetAllWebviewWindows()
  ).find(({ label }) => label === WebviewWindowLabel.Updater);

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
  }

  if (isMacOS) {
    await tauriCoreInvoke("init_nspanel");
    await tauriCoreInvoke("set_nspanel_ignore_cursor", {
      value: advanced.value.ignoreCursor,
    });
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      value: advanced.value.alwaysOnTop,
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

  await create();

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

    await Promise.all([
      overlayWebviewWindow.setPosition(new TauriDpiLogicalPosition(newX, newY)),
      overlayWebviewWindow.setSize(new TauriDpiLogicalSize(width, height)),
    ]);
  });
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
