import * as webviewWindow from "@tauri-apps/api/webviewWindow";
import * as autoStart from "@tauri-apps/plugin-autostart";
import { addImports, defineNuxtModule } from "nuxt/kit";
import * as process from "@tauri-apps/plugin-process";
import * as updater from "@tauri-apps/plugin-updater";
import * as opener from "@tauri-apps/plugin-opener";
import * as webview from "@tauri-apps/api/webview";
import * as window from "@tauri-apps/api/window";
import * as event from "@tauri-apps/api/event";
import * as image from "@tauri-apps/api/image";
import * as log from "@tauri-apps/plugin-log";
import * as menu from "@tauri-apps/api/menu";
import * as tray from "@tauri-apps/api/tray";
import * as core from "@tauri-apps/api/core";
import * as path from "@tauri-apps/api/path";
import * as os from "@tauri-apps/plugin-os";
import * as pinia from "@tauri-store/pinia";
import * as app from "@tauri-apps/api/app";
import * as dpi from "@tauri-apps/api/dpi";

const plugins = [
  {
    from: "@tauri-apps/api/webviewWindow",
    prefix: "WebviewWindow",
    plugin: webviewWindow,
  },
  {
    from: "@tauri-apps/plugin-autostart",
    prefix: "AutoStart",
    plugin: autoStart,
  },
  {
    from: "@tauri-apps/plugin-process",
    prefix: "Process",
    plugin: process,
  },
  {
    from: "@tauri-apps/plugin-log",
    prefix: "Log",
    plugin: log,
  },
  {
    from: "@tauri-apps/plugin-os",
    prefix: "OS",
    plugin: os,
  },
  {
    from: "@tauri-store/pinia",
    prefix: "Pinia",
    plugin: pinia,
  },
  {
    from: "@tauri-apps/api/app",
    prefix: "App",
    plugin: app,
  },
  {
    from: "@tauri-apps/api/tray",
    prefix: "Tray",
    plugin: tray,
  },
  {
    from: "@tauri-apps/api/menu",
    prefix: "Menu",
    plugin: menu,
  },
  {
    from: "@tauri-apps/api/dpi",
    prefix: "Dpi",
    plugin: dpi,
  },
  {
    from: "@tauri-apps/api/core",
    prefix: "Core",
    plugin: core,
  },
  {
    from: "@tauri-apps/api/window",
    prefix: "Window",
    plugin: window,
  },
  {
    from: "@tauri-apps/api/webview",
    prefix: "Webview",
    plugin: webview,
  },
  {
    from: "@tauri-apps/api/path",
    prefix: "Path",
    plugin: path,
  },
  {
    from: "@tauri-apps/plugin-opener",
    prefix: "Opener",
    plugin: opener,
  },
  {
    from: "@tauri-apps/api/event",
    prefix: "Event",
    plugin: event,
  },
  {
    from: "@tauri-apps/api/image",
    prefix: "Image",
    plugin: image,
  },
  {
    from: "@tauri-apps/plugin-updater",
    prefix: "Updater",
    plugin: updater,
  },
];

export default defineNuxtModule({
  setup() {
    plugins.forEach(({ plugin, prefix, from }) => {
      Object.keys(plugin)
        .filter((name) => name !== "default")
        .forEach((name) => {
          addImports({
            as: `${name.charAt(0) === name.charAt(0).toUpperCase() ? "T" : "t"}auri${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}`,
            from,
            name,
          });
        });
    });
  },
});
