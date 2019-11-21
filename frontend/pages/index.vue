<template>
  <v-content>
    <Navigation />
    <Home />
    <About />
    <Photos />
    <Contact />
  </v-content>
</template>

<script>
import Navigation from '~/components/Navigation'
import Home from '~/components/Home'
import About from '~/components/About'
import Photos from '~/components/Photos'
import Contact from '~/components/Contact'

export default {
  components: {
    Navigation, Home, About, Photos, Contact
  },
  computed: {
    settings () {
      return this.$store.getters['settings/loadedSettings']
    },
    photos () {
      return this.$store.getters['photos/loadedPhotos']
    }
  }
}
</script>
