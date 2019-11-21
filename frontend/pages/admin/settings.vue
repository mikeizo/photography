<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Settings
    </h2>

    <v-alert
      :value="alert"
      :type="alert_type"
      dismissible
      transition="fade-transition"
    >
      {{ alert_message }}
    </v-alert>

    <v-form @submit.prevent="saveSettings">
      <v-card>
        <v-row class="pa-5">
          <v-col cols="12" sm="6">
            <v-text-field
              @input="formHandler({ name: 'title', value: $event })"
              :value="settings.title"
              :rules="titleRules"
              label="Title"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              @input="formHandler({ name: 'subtitle', value: $event })"
              :value="settings.subtitle"
              :rules="subtitleRules"
              label="SubTitle"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-textarea
              @input="formHandler({ name: 'about', value: $event })"
              :value="settings.about"
              :rules="aboutRules"
              label="About"
              height="200"
              filled
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-textarea
              @input="formHandler({ name: 'tags', value: $event })"
              :value="settings.tags"
              label="Tags"
              height="200"
              filled
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-card-title class="title">
              Background Image
            </v-card-title>
            <v-card
              class="pa-5 mb-5"
              flat
              color="grey lighten-3"
            >
              <v-img
                v-if="settings.home_photo"
                :src="`/img/` + settings.home_photo"
                :lazy-src="``"
                height="300"
                contain
              >
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center>
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-layout>
                </template>
              </v-img>
            </v-card>
            <v-file-input
              v-model="home_photo"
              label="File input"
              accept="image/png, image/jpeg"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-card-title class="title">
              About Image
            </v-card-title>
            <v-card
              class="pa-5 mb-5"
              flat
              color="grey lighten-3"
            >
              <v-img
                v-if="settings.about_photo"
                :src="`/img/` + settings.about_photo"
                :lazy-src="``"
                contain
                height="300"
              >
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center>
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-layout>
                </template>
              </v-img>
            </v-card>
            <v-file-input
              v-model="about_photo"
              label="File input"
              accept="image/png, image/jpeg"
            />
          </v-col>

          <v-col>
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
      </v-card>
    </v-form>
  </v-col>
</template>

<script>

export default {
  layout: 'admin',
  data: () => ({
    loading: false,
    home_photo: null,
    about_photo: null,
    titleRules: [
      v => !!v || 'Title is required',
      v => (v && v.length < 50) || 'Title must be less than 50 characters',
      v => (v && v.length > 2) || 'Title must be more than 2 characters'
    ],
    subtitleRules: [
      v => !!v || 'Subtitle is required',
      v => (v && v.length < 100) || 'Subtitle must be less than 100 characters',
      v => (v && v.length > 5) || 'Subtitle must be more than 5 characters'
    ],
    aboutRules: [
      v => !!v || 'About is required',
      v => (v && v.length < 1500) || 'About must be less than 1500 characters',
      v => (v && v.length > 5) || 'About must be more than 5 characters'
    ],
    alert: false,
    alert_type: null,
    alert_message: null
  }),
  computed: {
    settings () {
      return this.$store.state.settings.settings
    }
  },
  methods: {
    formHandler (value) {
      this.$store.commit('settings/updateSettings', value)
    },
    async saveSettings () {
      this.loading = true
      const Settings = this
      const formData = new FormData()
      let check = false

      formData.append('title', this.settings.title)
      formData.append('subtitle', this.settings.subtitle)
      formData.append('about', this.settings.about)
      formData.append('tags', this.settings.tags)

      if (this.home_photo) {
        formData.append('home_photo', this.home_photo)
        check = true
      }
      if (this.about_photo) {
        formData.append('about_photo', this.about_photo)
        check = true
      }

      await this.$axios.post('admin/settings',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': this.$cookies.get('auth._token.local')
          }
        })
        .then(function (response) {
          Settings.loading = true
          Settings.alert_type = 'success'
          Settings.alert_message = 'Your settings have been updated'

          if (check) {
            Settings.$store.dispatch('settings/getSettings')
          }
        })
        .catch(function (error) {
          Settings.alert_type = 'error'
          Settings.alert_message = error.response.data.message
        })
        .finally(() => {
          Settings.alert = true
          Settings.loading = false
          Settings.home_photo = null
          Settings.about_photo = null
        })
    }
  }
}
</script>
