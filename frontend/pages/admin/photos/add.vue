<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Upload Photos
    </h2>
    <v-alert
      :value="alert"
      :type="alert_type"
      dismissible
      transition="fade-transition"
    >
      {{ alert_message }}
    </v-alert>

    <v-form
      ref="uploadForm"
      v-model="valid"
      @submit.prevent="submitFiles"
      lazy-validation
    >
      <v-card>
        <v-row class="pa-5">
          <v-col
            cols="12"
            sm="6"
          >
            <v-file-input
              v-model="photos"
              :counter="30"
              :rules="uploadRules"
              accept="image/png, image/jpeg"
              show-size
              multiple
              label="Click to upload photos"
            />
            <!--
            <label>
              <input
                id="photos"
                ref="photos"
                type="file"
                multiple
                accept="image/png, image/jpeg"
                @change="handleFileUpload()"
              >
            </label>
            -->
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-btn
              @click="submitFiles()"
              :loading="loading"
              color="primary"
            >
              Upload
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </v-col>
</template>

<script>

export default {
  layout: 'admin',
  data: () => ({
    photos: [],
    uploadRules: [
      v => (v && v.length <= 30) || 'No more than 30 files'
    ],
    valid: true,
    loading: false,
    alert: false,
    alert_type: null,
    alert_message: null
  }),
  methods: {
    /*
    handleFileUpload () {
      this.photos = this.$refs.photos.files
    },
    */
    submitFiles () {
      if (this.$refs.uploadForm.validate()) {
        this.loading = true
        const formData = new FormData()
        const Form = this

        for (let i = 0; i < this.photos.length; i++) {
          const file = this.photos[i]
          formData.append('photos[' + i + ']', file)
        }

        this.$axios.post('admin/photos',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': this.$cookies.get('auth._token.local')
            }
          })
          .then((response) => {
            Form.alert_type = 'success'
            Form.alert_message = 'Your file(s) have been uploaded!'
          })
          .catch((error) => {
            Form.alert_type = 'error'
            Form.alert_message = error.response.data.message
          })
          .finally(() => {
            Form.alert = true
            Form.loading = false
            Form.photos = []
          })
      }
    }
  }
}
</script>
