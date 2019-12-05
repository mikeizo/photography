<template>
  <v-dialog
    v-if="photoData"
    v-model="photoData"
    max-width="900px"
  >
    <v-card class="pa-5">
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title class="headline">
            Edit Photo
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ photoData.filename }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-spacer />
        <v-btn
          @click="photoData=false"
          color="black"
          fab
          small
          dark
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>
      <v-form @submit.prevent="savePhoto">
        <v-row>
          <v-col cols="12" sm="6">
            <v-img
              :src="`/img/photos/` + photoData.filename"
              height="300"
              max-width="350"
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center>
                  <v-progress-circular indeterminate color="grey lighten-2" />
                </v-layout>
              </template>
            </v-img>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="title"
              label="Title"
              clearable
            />
            <span class="headline">Categories</span>
            <v-checkbox
              v-for="category in categories"
              :key="category.id"
              v-model="categoriesSelected"
              :value="category.id"
              :label="category.name"
              :color="category.color"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="loading"
                type="submit"
                color="green"
                dark
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    photo: {
      type: [Boolean, Object],
      default: false
    }
  },
  data: () => ({
    categoriesSelected: [],
    error: false,
    loading: false,
    photoData: false,
    title: ''
  }),
  computed: {
    categories () {
      return this.$store.state.categories.categories
    }
  },
  watch: {
    photo (val) {
      this.photoData = val
      this.categoriesSelected = []
      this.title = val.title

      for (const selected in this.photoData.categories) {
        this.categoriesSelected.push(this.photoData.categories[selected].id)
      }
    },
    photoData (val) {
      if (!val) {
        this.$bus.$emit('refresh')
      }
    }
  },
  methods: {
    async savePhoto () {
      this.loading = true
      const Photo = this
      const payload = {
        categories: this.categoriesSelected,
        photos: [{
          id: this.photoData.id,
          title: this.title
        }]
      }

      await this.$axios.put('admin/photos/' + this.photoData.id,
        payload,
        {
          headers: {
            'Authorization': this.$cookies.get('auth._token.local')
          }
        })
        .then(function (response) {
          Photo.$store.dispatch('photos/updatePhotos', payload)
          Photo.photoData = false
        })
        .catch(function (error) {
          console.log(error)
          Photo.$bus.$emit('unauthorized')
        })
        .finally(() => {
          Photo.loading = false
        })
    }
  }
}
</script>
