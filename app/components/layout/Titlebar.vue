<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const isMacOS = tauriOSType() === "macos";
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);

async function destroy() {
  if (isMacOS) {
    await tauriCoreInvoke("convert_nspanel_to_webview_window", {
      label: currentWebviewWindow.label,
    });
  }
  await currentWebviewWindow.destroy();
}

async function onDragStart(e: MouseEvent) {
  if (e.button !== 0) {
    return;
  }

  e.preventDefault();

  const pos = await currentWebviewWindow.outerPosition();

  offsetX.value = e.screenX - pos.x;
  offsetY.value = e.screenY - pos.y;
  isDragging.value = true;
}

useEventListener(window, "mouseup", () => (isDragging.value = false));

useEventListener(window, "mousemove", async (e) => {
  if (!isDragging.value) {
    return;
  }

  currentWebviewWindow.setPosition(
    new TauriDpiLogicalPosition(
      e.screenX - offsetX.value,
      e.screenY - offsetY.value,
    ),
  );
});
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 h-8.25 flex items-center z-99 **:select-none pointer-events-auto"
    :class="{ 'flex-row-reverse': !isMacOS }"
    @mousedown="onDragStart"
  >
    <div
      class="flex"
      :class="{
        'pl-2.25 [&>button]:bg-secondary [&>button]:transition-none! [&>button]:size-4! [&>button]:p-0! [&>button]:rounded-full! [&>button]:border! [&_svg]:size-2.5! [&_svg]:hidden hover:[&_svg]:flex':
          isMacOS,
        '[&>button]:rounded-none [&>button]:h-full': !isMacOS,
      }"
    >
      <Button
        :class="{ 'hover:bg-red-600': !isMacOS }"
        variant="ghost"
        @click="destroy"
      >
        <Icon name="lucide:x" />
      </Button>
    </div>
  </div>
</template>
