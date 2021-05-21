<template>
  <section id="photos" class="grey lighten-4 py-10">
    <v-container>
      <v-row class="text-center">
        <h2
          class="display-2 font-weight-light mx-auto grey--text text--darken-3"
        >
          Photos
        </h2>
      </v-row>
      <v-divider class="my-5" />
      <v-tabs background-color="transparent" centered show-arrows class="mb-5">
        <v-tab flat @click="getPhotos('')"> All </v-tab>
        <v-tab
          v-for="category in categories"
          :key="category.name"
          flat
          @click="getPhotos(category.name)"
        >
          {{ category.name }}
        </v-tab>
      </v-tabs>
      <v-row>
        <v-col v-for="photo in photos" :key="photo.id" sm="6" md="4" lg="3">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              class="transition-swing"
              @click="openGallery(photo.id)"
            >
              <v-img :src="photo.src" height="250" max-height="250">
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <client-only>
        <LightBox
          v-if="photos.length"
          ref="lightbox"
          v-touch="{
            left: () => swipe('Left'),
            right: () => swipe('Right')
          }"
          :media="photos"
          :show-light-box="false"
          :show-thumbs="false"
        />
      </client-only>
    </v-container>
  </section>
</template>

<script>
export default {
  async fetch() {
    await this.$store.dispatch('photos/getPhotos')
    await this.$store.dispatch('categories/getCategories')
  },

  computed: {
    photos() {
      return this.$store.state.photos.photos.map((photo) => ({
        id: photo._id,
        thumb: `${process.env.awsS3}/photos/${photo.filename}`,
        src: `${process.env.awsS3}/photos/${photo.filename}`,
        caption: photo.title
      }))
    },

    categories() {
      return this.$store.state.categories.categories
    }
  },

  methods: {
    // Get photos
    getPhotos(category) {
      this.$store.dispatch('photos/updatePhotosCategory', category)
    },

    // Open photo in lightbox
    openGallery(index) {
      const photoId = this.photos.findIndex((photo) => photo.id === index)
      this.$refs.lightbox.showImage(photoId)
    },

    // Mobile swipe function for lightbox
    swipe(direction) {
      if (direction === 'Left') {
        this.$refs.lightbox.nextImage()
      } else if (direction === 'Right') {
        this.$refs.lightbox.previousImage()
      }
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
