<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card class="pa-5">
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title class="headline">Edit Category</v-list-item-title>
        </v-list-item-content>
        <v-spacer />
        <v-btn color="black" fab small dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>

      <v-form @submit.prevent="saveCategory">
        <v-row justify="space-between">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="category.name"
              :value="category.name"
              :rules="nameRules"
              label="Name"
              clearable
            >
              {{ category.name }}
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="category.color"
              :value="category.color"
              :background-color="category.color"
              :items="colors"
              :rules="colorRules"
              label="Color"
              prepend-icon="mdi-palette"
              class="color-style"
              dark
            >
              <template slot="item" slot-scope="data">
                <v-row>
                  <v-col :class="data.item" cols="12" dark>
                    <span class="white--text">
                      {{ data.item }}
                    </span>
                  </v-col>
                </v-row>
              </template>
            </v-select>
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
    categoryData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    oldName: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length < 25) || 'Name must be less than 25 characters',
      (v) => (v && v.length > 2) || 'Name must be more than 2 characters'
    ],
    colorRules: [(v) => !!v || 'Color is required']
  }),
  computed: {
    category() {
      return this.categoryData
    },
    colors() {
      return this.$store.state.categories.colors
    }
  },

  watch: {
    category(val) {
      this.dialog = true
    }
  },

  mounted() {
    this.oldName = this.categoryData.name
  },

  methods: {
    async saveCategory() {
      this.loading = true
      const Category = this
      const { name, color, _id } = this.category

      await this.$axios
        .post(`/api/categories/edit/${_id}`, {
          name,
          color,
          oldName: this.oldName
        })
        .then((res) => {
          Category.$emit('close-dialog')
          Category.$store.commit('categories/updateCategory', Category.category)
          Category.$store.commit('setSnackbar', {
            show: true,
            message: 'Success! Category has been updated',
            color: 'green'
          })
        })
        .catch((error) => {
          Category.$store.commit('setSnackbar', {
            show: true,
            message: error,
            color: 'red'
          })
        })
        .finally(() => {
          Category.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.color-style {
  .v-select__selections {
    padding: 5px 20px !important;
  }
}
</style>
