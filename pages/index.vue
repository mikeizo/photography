<template>
  <v-main>
    <Contact />
    <Navigation />
    <section id="home">
      <v-parallax :src="`${awsS3}/home-bg.jpg`" height="800">
        <v-row align="center" justify="center">
          <v-col class="caption text-center" cols="12">
            <h2 class="display-3 mb-3 mt-0">{{ settings.title }}</h2>
            <h1 class="display-1">{{ settings.subtitle }}</h1>
          </v-col>
        </v-row>
      </v-parallax>
    </section>
    <section id="about" class="grey darken-4 white--text py-10">
      <v-container>
        <v-row justify="space-between">
          <v-col sm="6" md="4">
            <v-card elevation="10">
              <v-img
                :lazy-src="`${awsS3}/about.jpg`"
                :src="`${awsS3}/about.jpg`"
                class="border--white"
              >
                <template #placeholder>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-progress-circular indeterminate color="green" />
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
          <v-col sm="5" md="7">
            <h2 class="display-2 font-weight-light">About</h2>
            <v-divider class="my-4" dark />
            <div v-html="settings.about"></div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <Photos />
  </v-main>
</template>

<script>
import Navigation from '~/components/Navigation'
import Photos from '~/components/Photos'
import Contact from '~/components/Contact'

export default {
  components: {
    Navigation,
    Photos,
    Contact
  },

  data: () => ({
    description:
      'This website is dedicated in memory of Stephen LePorisz. He had a passion for photography, and dedicated many hours to the art. View a some of the amazing photos taken by Steve he thought were some of his best pictures.'
  }),

  head() {
    return {
      title: this.settings.metaTitle,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.settings.metaKeywords
        },
        {
          hid: 'description',
          name: 'description',
          content: this.settings.metaDescription
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.settings.metaTitle
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.settings.metaDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.awsS3}/${this.settings.homePhoto}`
        }
      ]
    }
  },

  computed: {
    settings() {
      return this.$store.state.settings
    },
    awsS3() {
      return process.env.awsS3
    }
  },

  created() {
    this.$store.dispatch('getSettings')
  }
}
</script>

<style lang="scss" scoped>
.caption h1,
.caption h2 {
  text-shadow: 1px 1px 5px $black;
}
</style>
