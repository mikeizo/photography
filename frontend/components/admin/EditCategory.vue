<template>
  <v-dialog
    v-if="categoryData"
    v-model="categoryData"
    max-width="900px"
  >
    <v-card class="pa-5">
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title class="headline">
            Edit Category
          </v-list-item-title>
        </v-list-item-content>
        <v-spacer />
        <v-btn
          @click="categoryData=null"
          color="black"
          dark
          fab
          small
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>

      <v-form @submit.prevent="saveCategory">
        <v-row justify="space-between">
          <v-col cols="12" sm="6">
            <v-text-field
              @input="formHandler({ name: 'name', value: $event })"
              :value="categoryData.name"
              :rules="nameRules"
              label="Name"
              clearable
            >
              {{ categoryData.name }}
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              @input="formHandler({ name: 'color', value: $event })"
              :value="categoryData.color"
              :background-color="categoryData.color"
              :items="colors"
              :rules="colorRules"
              label="Color"
              prepend-icon="mdi-palette"
              class="color-style"
              dark
            >
              <template slot="item" slot-scope="data">
                <v-row>
                  <v-col
                    :class="data.item"
                    cols="12"
                    dark
                  >
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
    category: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    categoryData: null,
    loading: false,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length < 25) || 'Name must be less than 25 characters',
      v => (v && v.length > 2) || 'Name must be more than 2 characters'
    ],
    colorRules: [
      v => !!v || 'Color is required'
    ]
  }),
  computed: {
    colors () {
      return this.$store.state.categories.colors
    }
  },
  watch: {
    category (val) {
      this.categoryData = val
    },
    categoryData (val) {
      if (!val) {
        this.$bus.$emit('refresh')
      }
    }
  },
  methods: {
    formHandler (value) {
      const payload = {
        'id': this.categoryData.id,
        'name': value.name,
        'value': value.value
      }
      this.$store.commit('categories/updateCategory', payload)
    },
    async saveCategory () {
      this.loading = true
      const Category = this
      const payload = {
        form: this.categoryData
      }

      await this.$axios.put('admin/categories/' + this.categoryData.id,
        payload,
        {
          headers: {
            'Authorization': this.$cookies.get('auth._token.local')
          }
        })
        .then(function (response) {
          Category.$store.dispatch('categories/updateCategory', Category.categoryData)
          Category.categoryData = false
        })
        .catch(function (error) {
          console.log(error)
          Category.$bus.$emit('unauthorized')
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
