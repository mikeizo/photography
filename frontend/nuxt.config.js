import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'Photography Portfolio',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:300,500,700' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Italianno' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'vue-image-lightbox/dist/vue-image-lightbox.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/bus' },
    { src: '@/plugins/vue-image-lightbox', mode: 'client' },
    { src: '@/plugins/vue-lazyload' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt'
  ],
  /*
   ** SCSS style
   */
  styleResources: {
    scss: [
      './assets/scss/*.scss'
    ]
  },
  /*
   ** Auth module configuration
   ** See https://axios.nuxtjs.org/options
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post',
            propertyName: 'access_token'
          },
          logout: {
            url: 'auth/logout',
            method: 'post'
          },
          user: {
            url: 'auth/user',
            method: 'post',
            propertyName: 'username'
          }
        },
      }
    },
    redirect: {
      login: '/admin/login',
      logout: '/admin/login',
      callback: '/admin/login',
      home: '/'
    },
    localStorage: false,
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.APP_URL
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.blue.darken3,
          secondary: colors.blue.lighten2,
          accent: colors.blue.base,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.base
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true,
    extend(config, ctx) {}
  },
  env: {
    baseUrl: process.env.APP_URL || 'http://localhost:3000'
  }
}
