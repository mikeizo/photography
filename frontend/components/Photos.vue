<template>
  <section id="photos" class="grey lighten-3 py-10">
    <v-container>
      <v-row class="text-center">
        <h2 class="display-2 font-weight-thin mx-auto">
          Photos
        </h2>
      </v-row>

      <v-divider class="my-5" />

      <v-tabs
        background-color="transparent"
        color="green"
        slider-color="green"
        centered
        show-arrows
        class="mb-5"
      >
        <v-tab
          @click="getPhotos(0)"
          flat
        >
          All
        </v-tab>
        <v-tab
          @click="getPhotos(category.id)"
          v-for="category in categories"
          :key="category.id"
          flat
        >
          {{ category.name }}
        </v-tab>
      </v-tabs>

      <client-only>
        <v-row style="position:relative">
          <v-col cols="12" class="pa-0 ma-0">
            <div v-if="loading" class="loader">
              <v-progress-circular indeterminate color="green" size="64" />
            </div>
          </v-col>
          <v-col
            v-for="photo in photos"
            :key="photo.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover>
              <v-card
                @click="openGallery(photo.id)"
                :class="`elevation-${hover ? 12 : 2}`"
                :height="photoSize"
                slot-scope="{ hover }"
                style="overflow: hidden;"
              >
                <img
                  v-lazy="photo.thumb"
                  style="height: auto; width: 100%;"
                >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <LightBox
          ref="lightbox"
          v-touch="{
            left: () => swipe('Left'),
            right: () => swipe('Right'),
          }"
          :images="photos"
          :show-light-box="false"
          :show-thumbs="false"
        />
      </client-only>
    </v-container>
  </section>
</template>

<script>

export default {
  data: () => ({
    loading: false,
    photoSize: 250
  }),
  computed: {
    photos () {
      return this.$store.state.photos.photos
    },
    categories () {
      return this.$store.state.categories.categories
    }
  },
  mounted () {
    // Change photo size if xs breakpoint
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    // Mobile swipe function for lightbox
    swipe (direction) {
      if (direction === 'Left') {
        this.$refs.lightbox.nextImage()
      } else if (direction === 'Right') {
        this.$refs.lightbox.previousImage()
      }
    },
    openGallery (index) {
      const photoId = this.photos.findIndex(
        photo => photo.id === index
      )
      this.$refs.lightbox.showImage(photoId)
    },
    // Get photos by category
    async getPhotos (category = 0) {
      const Photo = this
      this.loading = true
      await this.$axios.get('photos?cat=' + category)
        .then(function (response) {
          Photo.$store.dispatch('photos/updatePhotosCategory', response.data)
          Photo.loading = false
        })
    },
    // Resize photo display for mobile
    handleResize () {
      this.photoSize = document.documentElement.clientWidth > 600 ? 250 : 350
    }
  }
}
</script>

<style lang="scss" scoped>
  #photos {
    min-height: 800px;
    .v-card {
      cursor: pointer;
    }
  }
</style>
