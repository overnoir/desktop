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
    const webviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();

    if (!isMacOS || !isNSPanel) {
      return webviewWindow;
    }

    return proxy(webviewWindow);
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
