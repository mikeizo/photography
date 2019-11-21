<template>
  <v-app v-cloak light>
    <v-layout row wrap>
      <Navigation />
      <Unauthorized />
      <transition name="fade" mode="out-in">
        <v-content>
          <v-container fluid px-12>
            <v-row>
              <transition name="fade" mode="out-in">
                <nuxt />
              </transition>
            </v-row>
          </v-container>
        </v-content>
      </transition>
    </v-layout>
  </v-app>
</template>

<script>
import Navigation from '~/components/admin/Navigation'
import Unauthorized from '~/components/admin/Unauthorized'

export default {
  middleware: 'auth',
  components: {
    Navigation, Unauthorized
  }
}
</script>

<style lang="scss">
  body {
    font-family: 'Raleway', sans-serif;
    line-height: 2.2rem;
    font-size: 18px;
  }

  // Loading overlay
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffffeb;
    z-index: 9999;
    .v-progress-circular {
      left:50%;
      top: 30vh;
    }
  }
  .noscroll {
    height: 100vh;
    overflow: hidden;
  }
</style>
