<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Add Category
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
      ref="colorForm"
      v-model="valid"
      @submit.prevent="addCategory"
      lazy-validation
    >
      <v-card>
        <v-row class="pa-5" justify="space-between">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="category.name"
              :rules="nameRules"
              label="Name"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="category.color"
              :items="colors"
              :rules="colorRules"
              label="Color"
              class="px-0"
              prepend-icon="mdi-palette"
            >
              <template slot="item" slot-scope="data">
                <v-row>
                  <v-col
                    :class="data.item"
                    dark
                    cols="12"
                  >
                    <span class="white--text">
                      {{ data.item }}
                    </span>
                  </v-col>
                </v-row>
              </template>
            </v-select>
          </v-col>
          <v-col colss="6">
            <v-btn
              :loading="loading"
              color="primary"
              class="mx-0"
              type="submit"
            >
              Submit
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
    category: {
      name: '',
      color: ''
    },
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 25) || 'Name must be less than 25 characters',
      v => (v && v.length > 2) || 'Name must be more than 2 or characters'
    ],
    colorRules: [
      v => !!v || 'Color is required'
    ],
    colorForm: [],
    alert: false,
    alert_message: null,
    alert_type: null,
    valid: true,
    loading: false
  }),
  computed: {
    colors () {
      return this.$store.state.categories.colors
    }
  },
  methods: {
    async addCategory () {
      if (this.$refs.colorForm.validate()) {
        this.loading = true
        const Category = this
        const payload = { name: this.category.name, color: this.category.color }

        await this.$axios.post('admin/categories',
          payload,
          {
            headers: {
              'Authorization': this.$cookies.get('auth._token.local')
            }
          })
          .then(function (response) {
            Category.$store.dispatch('categories/addCategory', payload)
            Category.alert_type = 'success'
            Category.alert_message = 'Category has been added!'
          })
          .catch(function (error) {
            Category.alert_type = 'error'
            Category.alert_message = error.response.data.message
          })
          .finally(() => {
            Category.loading = false
            Category.alert = true
            Category.$refs.colorForm.reset()
          })
      }
    }
  }
}
</script>
