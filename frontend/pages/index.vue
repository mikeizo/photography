<template>
  <v-content>
    <Navigation />
    <Home />
    <About />
    <Photos />
    <Contact />
    <span v-html="settings.tags" />
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
      return this.$store.state.settings.settings
    }
  },
  head () {
    return {
      title: this.settings.meta_title,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.settings.meta_keywords },
        { hid: 'description', name: 'description', content: this.settings.meta_description }
      ]
    }
  }
}
</script>
