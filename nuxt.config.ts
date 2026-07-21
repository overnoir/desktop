export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-security",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "vue-sonner/nuxt",
    "@comark/nuxt",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  compatibilityDate: "2026-05-02",
  devtools: { enabled: false },
  ssr: false,
  i18n: {
    detectBrowserLanguage: false,
    defaultLocale: "en",
    locales: [
      {
        language: "tr-TR",
        name: "Türkçe",
        file: "tr.ts",
        code: "tr",
      },
      {
        language: "en-US",
        name: "English",
        file: "en.ts",
        code: "en",
      },
      {
        language: "de-DE",
        name: "Deutsch",
        file: "de.ts",
        code: "de",
      },
      {
        language: "fr-FR",
        name: "Français",
        file: "fr.ts",
        code: "fr",
      },
      {
        language: "pt-PT",
        name: "Português",
        file: "pt.ts",
        code: "pt",
      },
      {
        language: "es-ES",
        name: "Español",
        file: "es.ts",
        code: "es",
      },
    ],
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        "upgrade-insecure-requests": false,
        "img-src": "'self' https:",
      },
    },
  },
  fonts: {
    families: [
      {
        src: "~/assets/fonts/inter.ttf",
        weights: [400, 500, 600],
        name: "Inter",
      },
    ],
    provider: "local",
  },
  vite: {
    envPrefix: ["VITE_", "TAURI_"],
    clearScreen: false,
    server: {
      strictPort: true,
    },
  },
  experimental: {
    viteEnvironmentApi: true,
  },
  ignore: ["**/src-tauri/**"],
  veeValidate: {
    componentNames: {
      Field: "VeeField",
    },
  },
  icon: {
    serverBundle: "local",
    mode: "svg",
    clientBundle: {
      scan: true,
    },
  },
  image: {
    provider: "none",
  },
  typescript: {
    typeCheck: true,
  },
  imports: {
    dirs: ["types"],
  },
  shadcn: {
    prefix: "",
  },
});
