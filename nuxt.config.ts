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
        language: "en-EN",
        name: "English",
        file: "en.ts",
        code: "en",
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
