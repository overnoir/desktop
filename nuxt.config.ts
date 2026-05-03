export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-security",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],
  compatibilityDate: "2026-05-02",
  devtools: { enabled: false },
  ssr: false,
  i18n: {
    defaultLocale: "tr",
    locales: [
      {
        language: "tr-TR",
        name: "Türkçe",
        file: "tr.ts",
        code: "tr",
      },
    ],
  },
  vite: {
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
    },
  },
  fonts: {
    families: [
      {
        weights: [400, 500, 600],
        name: "Inter",
        global: true,
      },
    ],
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
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
  imports: {
    dirs: ["types"],
  },
  typescript: {
    typeCheck: true,
  },
  shadcn: {
    prefix: "",
  },
  icon: {
    mode: "svg",
  },
});
