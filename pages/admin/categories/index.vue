<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light">Categories</h2>

    <v-data-table
      :headers="headers"
      :items="categories"
      item-key="_id"
      hide-default-footer
    >
      <template #item.color="{ item }">
        <v-chip :color="item.color" class="ma-2" dark>
          {{ item.color }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon @click="openDialog(item)">
          <v-icon color="blue">mdi-circle-edit-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="
            deleteItem = item
            deleteDialog = true
          "
        >
          <v-icon color="red">mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- DIALOG -->
    <EditCategory :category-data="categoryData" />

    <v-dialog
      v-if="deleteDialog"
      v-model="deleteDialog"
      persistent
      max-width="500px"
    >
      <v-card class="pa-2">
        <v-card-title class="h4">
          <v-spacer></v-spacer>
          Are you sure you want to delete?
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn :loading="loading" color="error" @click="deleteCategory">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import EditCategory from '~/components/admin/EditCategory'

export default {
  components: { EditCategory },
  layout: 'admin',
  data: () => ({
    loading: false,
    dialog: false,
    selected: [],
    categoryData: {},
    categoryDelete: '',
    deleteDialog: false,
    deleteItem: null,
    headers: [
      { text: 'Name', value: 'name', align: 'left', sortable: true },
      { text: 'Color', value: 'color', align: 'center', sortable: true },
      { text: 'Actions', value: 'actions', align: 'right', sortable: false }
    ]
  }),

  computed: {
    categories() {
      return this.$store.state.categories.categories
    }
  },

  created() {
    this.$store.dispatch('categories/getCategories')
  },

  methods: {
    openDialog(data) {
      this.categoryData = Object.assign({}, data)
      this.dialog = true
    },

    async deleteCategory() {
      this.loading = true
      const Category = this
      const id = this.deleteItem._id

      await this.$axios
        .delete(`/api/categories/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function (res) {
          Category.$store.commit('categories/deleteCategory', id)
        })
        .finally(() => {
          Category.loading = false
          Category.deleteDialog = false
        })
    }
  }
}
</script>
