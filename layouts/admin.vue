<template>
  <v-app v-cloak>
    <Navigation />
    <transition name="fade" mode="out-in">
      <v-main>
        <v-container class="py-8 px-6" fluid>
          <v-row>
            <v-col cols="12">
              <v-card class="pa-3">
                <nuxt />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </transition>
  </v-app>
</template>

<script>
import Navigation from '~/components/admin/Navigation'

export default {
  components: {
    Navigation
  },
  middleware: ['auth', 'validate']
}
</script>
