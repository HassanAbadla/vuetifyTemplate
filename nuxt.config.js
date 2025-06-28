export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Nuxt App",
    title: "Nuxt App",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Base URL for API requests
    baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
    // Automatically set request headers
    credentials: true,
    // Debug mode
    debug: process.env.NODE_ENV === "development",
    // Proxy configuration (optional)
    proxy: false,
    // Retry failed requests
    retry: { retries: 3 },
    // Request timeout
    timeout: 10000,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#1976d2",
          accent: "#82b1ff",
          secondary: "#424242",
          info: "#2196f3",
          warning: "#fb8c00",
          error: "#ff5252",
          success: "#4caf50",
        },
        light: {
          primary: "#1976d2",
          accent: "#82b1ff",
          secondary: "#424242",
          info: "#2196f3",
          warning: "#fb8c00",
          error: "#ff5252",
          success: "#4caf50",
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Extract CSS to separate files
    extractCSS: true,
    // Optimize CSS
    optimizeCSS: true,
    // Split chunks
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  },

  // Environment variables
  env: {
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000/api",
  },

  // Loading configuration
  loading: {
    color: "#1976d2",
    height: "3px",
  },

  // Runtime config
  publicRuntimeConfig: {
    axios: {
      browserBaseURL:
        process.env.BROWSER_BASE_URL || "http://localhost:3000/api",
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
    },
  },
}
