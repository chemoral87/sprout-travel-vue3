// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.css",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/styles/main.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
