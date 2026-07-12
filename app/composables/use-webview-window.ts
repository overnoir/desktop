import type { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import type { PhysicalPosition } from "@tauri-apps/api/dpi";
import type { WindowOptions } from "@tauri-apps/api/window";
import type { WebviewOptions } from "@tauri-apps/api/webview";

export default function () {
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

    if (!webviewWindow || !isMacOS || !(isNSPanel ?? true)) {
      return webviewWindow;
    }

    return proxy(webviewWindow);
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
        label: string;
      },
  ) {
    if (isMacOS) {
      await tauriCoreInvoke("create_nspanel", { ...options });
    } else {
      new TauriWebviewWindowWebviewWindow(options.label, options);
    }
  }

  return { getByLabel, getCurrent, create };
}
