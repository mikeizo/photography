<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light">Settings</h2>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveSettings"
    >
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="settings.title"
            :value="settings.title"
            :rules="titleRules"
            label="Title"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="settings.subtitle"
            :value="settings.subtitle"
            :rules="subtitleRules"
            label="SubTitle"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="settings.about"
            :value="settings.about"
            :rules="aboutRules"
            label="About"
            height="200"
            filled
          />
        </v-col>
        <!-- Meta Data -->
        <v-col cols="12">
          <v-text-field
            v-model="settings.metaTitle"
            :value="settings.metaTitle"
            :rules="metaTitleRules"
            label="Meta Title"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="settings.metaKeywords"
            :value="settings.metaKeywords"
            :rules="metaKeywordRules"
            label="Meta Keywords"
            height="200"
            filled
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="settings.metaDescription"
            :value="settings.metaDescription"
            :rules="metaDescriptionRules"
            label="Meta Description"
            height="200"
            filled
          />
        </v-col>
        <v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="loading" type="submit" color="green" dark>
              Save
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script>
export default {
  layout: 'admin',
  data: () => ({
    settings: [],
    loading: false,
    valid: true,
    // Form rules
    titleRules: [
      (v) => !!v || 'Title is required',
      (v) => (v && v.length < 50) || 'Title must be less than 50 characters',
      (v) => (v && v.length > 2) || 'Title must be more than 2 characters'
    ],
    subtitleRules: [
      (v) => !!v || 'Subtitle is required',
      (v) =>
        (v && v.length < 100) || 'Subtitle must be less than 100 characters',
      (v) => (v && v.length > 5) || 'Subtitle must be more than 5 characters'
    ],
    aboutRules: [
      (v) => !!v || 'About is required',
      (v) =>
        (v && v.length < 1500) || 'About must be less than 1500 characters',
      (v) => (v && v.length > 5) || 'About must be more than 5 characters'
    ],
    metaTitleRules: [
      (v) => !!v || 'Meta title is required',
      (v) =>
        (v && v.length < 60) || 'Meta title must be less than 60 characters',
      (v) => (v && v.length > 5) || 'Title must be more than 5 characters'
    ],
    metaKeywordRules: [
      (v) => !!v || 'Meta keywords is required',
      (v) =>
        (v && v.length < 255) ||
        'Meta keyword must be less than 255 characters',
      (v) =>
        (v && v.length > 5) || 'Meta keywords must be more than 5 characters'
    ],
    metaDescriptionRules: [
      (v) => !!v || 'Meta description is required',
      (v) =>
        (v && v.length < 160) ||
        'Meta description must be less than 160 characters',
      (v) =>
        (v && v.length > 5) ||
        'Meta descriptions must be more than 5 characters'
    ]
  }),

  async created() {
    await this.$store.dispatch('getSettings')
    this.settings = Object.assign({}, this.$store.state.settings)
  },

  methods: {
    async saveSettings() {
      this.loading = true
      const Settings = this

      await this.$axios
        .post('/api/settings', this.settings)
        .then(() => {
          Settings.loading = true
          Settings.$store.commit('setSnackbar', {
            show: true,
            message: 'Success! Settings have been updated',
            color: 'green'
          })
        })
        .catch((error) => {
          Settings.$store.commit('setSnackbar', {
            show: true,
            message: error,
            color: 'red'
          })
        })
        .finally(() => {
          Settings.loading = false
        })
    }
  }
}
</script>
