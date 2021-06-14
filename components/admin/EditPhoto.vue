<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card class="pa-5">
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title class="headline">Edit Photo</v-list-item-title>
          <v-list-item-subtitle>
            {{ photoData.filename }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-spacer />
        <v-btn color="black" fab small dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>
      <v-form @submit.prevent="updatePhoto">
        <v-row>
          <v-col cols="12" sm="6">
            <v-img
              :src="`${awsUrl}/photos/${photoData.filename}`"
              height="300"
              max-width="350"
            >
              <template #placeholder>
                <v-layout fill-height align-center justify-center>
                  <v-progress-circular indeterminate color="grey lighten-2" />
                </v-layout>
              </template>
            </v-img>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="photo.title"
              :value="photo.title"
              label="Title"
              name="title"
              clearable
            />
            <span class="headline">Categories</span>
            <v-checkbox
              v-for="category in categories"
              :key="category._id"
              v-model="photo.category"
              :value="category._id"
              :label="category.name"
              :color="category.color"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading" type="submit" color="green" dark>
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
    photoData: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    dialog: false,
    awsUrl: process.env.awsS3,
    loading: false
  }),

  computed: {
    categories() {
      return this.$store.state.categories.categories
    },
    photo() {
      return this.photoData
    }
  },

  watch: {
    photo(val) {
      this.dialog = true
    }
  },

  methods: {
    async updatePhoto() {
      this.loading = true
      const Photo = this
      const { _id, title, category } = this.photo

      await this.$axios
        .post(`/api/photos/edit/${_id}`, {
          title,
          category
        })
        .then(() => {
          Photo.$emit('close-dialog')
          Photo.$store.commit('photos/updatePhoto', Photo.photo)
          Photo.$store.commit('setSnackbar', {
            show: true,
            message: 'Success! Your photo has been updated',
            color: 'green'
          })
          Photo.dialog = false
        })
        .catch((error) => {
          Photo.$store.commit('setSnackbar', {
            show: true,
            message: error,
            color: 'red'
          })
        })
        .finally(() => {
          Photo.snackbar = true
          Photo.loading = false
        })
    }
  }
}
</script>
