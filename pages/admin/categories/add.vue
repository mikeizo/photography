<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light">Add Category</h2>

    <v-form
      ref="categoryForm"
      v-model="valid"
      lazy-validation
      @submit.prevent="addCategory"
    >
      <v-row>
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
                <v-col :class="data.item" dark cols="12">
                  <span class="white--text">
                    {{ data.item }}
                  </span>
                </v-col>
              </v-row>
            </template>
          </v-select>
        </v-col>
        <v-col colss="6">
          <v-btn :loading="loading" color="primary" class="mx-0" type="submit">
            Submit
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
    category: {
      name: '',
      color: ''
    },
    categoryForm: [],
    valid: true,
    loading: false,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 25) || 'Name must be less than 25 characters',
      (v) => (v && v.length > 2) || 'Name must be more than 2 or characters'
    ],
    colorRules: [(v) => !!v || 'Color is required']
  }),

  computed: {
    colors() {
      return this.$store.state.categories.colors
    }
  },

  methods: {
    async addCategory() {
      if (this.$refs.categoryForm.validate()) {
        this.loading = true
        const Category = this

        await this.$axios
          .post('/api/categories', this.category)
          .then(() => {
            Category.$router.push('/admin/categories')
            Category.$store.commit('setSnackbar', {
              show: true,
              message: 'Success! Your category has been added',
              color: 'green'
            })
          })
          .catch((error) => {
            Category.$store.commit('setSnackbar', {
              show: true,
              message: error,
              color: 'error'
            })
          })
          .finally(() => {
            Category.loading = false
          })
      }
    }
  }
}
</script>
