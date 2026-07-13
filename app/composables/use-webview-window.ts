import type { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { PhysicalPosition } from "@tauri-apps/api/dpi";
import type { WindowOptions } from "@tauri-apps/api/window";
import { clamp } from "@vueuse/core";

export default function () {
  const { general } = storeToRefs(useSettingsStore());
  const isMacOS = tauriOSType() === "macos";

  function proxy(webviewWindow: WebviewWindow) {
    return new Proxy(webviewWindow, {
      get(target, prop, receiver) {
        if (prop === "setAlwaysOnTop") {
          return (value: boolean) =>
            tauriCoreInvoke("set_nspanel_always_on_top", {
              label: webviewWindow.label,
              value,
            });
        }

        if (prop === "setIgnoreCursorEvents") {
          return (value: boolean) =>
            tauriCoreInvoke("set_nspanel_ignore_cursor", {
              label: webviewWindow.label,
              value,
            });
        }

        if (prop === "destroy") {
          return () =>
            tauriCoreInvoke("destroy_nspanel", {
              label: webviewWindow.label,
            });
        }

        if (prop === "onMoved") {
          return (callback: (event: { payload: PhysicalPosition }) => void) => {
            return tauriEventListen<PhysicalPosition>(
              "nspanel-moved",
              callback,
            );
          };
        }

        const propValue = Reflect.get(target, prop, receiver);

        return typeof propValue === "function"
          ? propValue.bind(target)
          : propValue;
      },
    });
  }

  async function getByLabel({
    label,
    isNSPanel,
  }: {
    label: WebviewWindowLabel;
    isNSPanel?: boolean;
  }) {
    const webviewWindow =
      await TauriWebviewWindowWebviewWindow.getByLabel(label);

    return !webviewWindow || !isMacOS || !(isNSPanel ?? true)
      ? webviewWindow
      : proxy(webviewWindow);
  }

  function getCurrent(
    { isNSPanel }: { isNSPanel?: boolean } = { isNSPanel: true },
  ) {
    const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
    const isDragging = useState("is-dragging", () => false);
    const offset = ref({ x: 0, y: 0 });

    async function onDragStart(e: MouseEvent) {
      if (e.button !== 0) {
        return;
      }

      e.preventDefault();

      const { x, y } = await currentWebviewWindow.outerPosition();

      offset.value = { x: e.screenX - x, y: e.screenY - y };
      document.body.style.pointerEvents = "none";
      isDragging.value = true;
    }

    function listenDrag() {
      useEventListener(window, "mouseup", () => {
        document.body.style.pointerEvents = "auto";
        isDragging.value = false;
      });

      useEventListener(window, "mousemove", async (e) => {
        if (!isDragging.value) {
          return;
        }

        currentWebviewWindow.setPosition(
          new TauriDpiLogicalPosition(
            e.screenX - offset.value.x,
            e.screenY - offset.value.y,
          ),
        );
      });
    }

    return {
      currentWebviewWindow:
        !isMacOS || !isNSPanel
          ? currentWebviewWindow
          : proxy(currentWebviewWindow),
      onDragStart,
      isDragging,
      listenDrag,
    };
  }

  async function create(
    options: Omit<WebviewOptions, "x" | "y" | "width" | "height"> &
      WindowOptions & {
        canBecomeKeyWindow?: boolean;
        withEventHandler?: boolean;
        label: WebviewWindowLabel;
      },
  ) {
    const overlayWebviewWindow = await getByLabel({
      label: WebviewWindowLabel.Overlay,
    });
    const height = options.height!;
    const width = options.width!;
    let x = options.x;
    let y = options.y;
    const gap = 10;

    if (overlayWebviewWindow) {
      const position = await overlayWebviewWindow.outerPosition();
      const size = await overlayWebviewWindow.outerSize();
      const monitor = await tauriWindowCurrentMonitor();

      if (general.value.orientation === Orientation.Vertical) {
        const after = position.x + size.width + gap;
        const before = position.x - width - gap;
        x = monitor
          ? after + width <= monitor.position.x + monitor.size.width
            ? after
            : before >= monitor.position.x
              ? before
              : after
          : after;
        y = position.y;
      } else {
        const after = position.y + size.height + gap;
        const before = position.y - height - gap;
        y = monitor
          ? after + height <= monitor.position.y + monitor.size.height
            ? after
            : before >= monitor.position.y
              ? before
              : after
          : after;
        x = position.x;
      }

      if (monitor) {
        x = clamp(
          x,
          monitor.position.x + gap,
          monitor.position.x + monitor.size.width - width - gap,
        );
        y = clamp(
          y,
          monitor.position.y + gap,
          monitor.position.y + monitor.size.height - height - gap,
        );
      }
    }

    if (isMacOS) {
      await tauriCoreInvoke("create_nspanel", {
        ...options,
        x,
        y,
      });
    } else {
      new TauriWebviewWindowWebviewWindow(options.label, {
        ...options,
        x,
        y,
      });
    }
  }

  return { getByLabel, getCurrent, create };
}
