import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Italianno&display=swap'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['vue-image-lightbox/dist/vue-image-lightbox.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vue-image-lightbox', mode: 'client' },
    { src: '@/plugins/vue-lazyload' },
    { src: '@/plugins/vue-gtag' }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    ['@nuxtjs/dotenv', { only: ['APP_URL'] }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.APP_URL
  },

  // SCSS style
  styleResources: {
    scss: ['./assets/scss/*.scss']
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    defaultAssets: {
      font: {
        family: 'Raleway'
      },
      icons: 'mdi'
    },
    treeShake: true,
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.green.base,
          secondary: colors.blue.darken3,
          accent: colors.blue.base,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.base
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // extractCSS: true,
  },

  // Server Middleware API
  serverMiddleware: {
    '/api': '~/api/index',
    '/api/photos': '~/api/photos',
    '/api/categories': '~/api/categories',
    '/api/auth': '~/api/auth',
    '/api/hello': '~api/hello'
  },

  watch: ['~/api/*.js', '~/utils/*.js'],

  // Enviornmental variables
  env: {
    awsS3: 'https://mtropea.s3.amazonaws.com/photography',
    baseUrl: process.env.APP_URL || 'http://localhost:3000'
  },

  // Auth module configuration: https://axios.nuxtjs.org/options
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'token',
            required: true
          },
          logout: false,
          user: false
        }
      }
    },
    redirect: {
      login: '/admin/login',
      logout: '/admin/login',
      callback: '/admin/login',
      home: '/admin/photos'
    },
    localStorage: false
  }
}
