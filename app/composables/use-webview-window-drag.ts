export default function () {
  const currentWebviewWindow = useWebviewWindow().getCurrent();
  const isDragging = useState("is-dragging", () => false);
  const isInitialized = ref(false);
  const offsetX = ref(0);
  const offsetY = ref(0);

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

  if (!isInitialized.value) {
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

    isInitialized.value = true;
  }

  return { isDragging, onDragStart };
}
