<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">Add Photos</h2>
    <v-form
      ref="uploadForm"
      v-model="valid"
      enctype="multipart/form-data"
      lazy-validation
      @submit.prevent="submitFiles"
    >
      <v-row>
        <v-col cols="12" sm="6">
          <v-file-input
            v-model="photos"
            :counter="40"
            :rules="uploadRules"
            accept="image/png, image/jpeg"
            show-size
            multiple
            label="Click to upload photos"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn :loading="loading" color="primary" @click="submitFiles()">
            Upload
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script>
export default {
  layout: 'admin',
  data: () => ({
    photos: [],
    uploadRules: [(v) => (v && v.length <= 40) || 'No more than 40 files'],
    valid: true,
    loading: false
  }),

  methods: {
    submitFiles() {
      if (this.$refs.uploadForm.validate()) {
        this.loading = true
        const formData = new FormData()
        const Form = this

        for (let i = 0; i < this.photos.length; i++) {
          formData.append(`photos`, this.photos[i])
        }

        this.$axios
          .post('/api/photos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            Form.loading = false
            Form.photos = []
          })
      }
    }
  }
}
</script>
