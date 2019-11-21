<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Categories
    </h2>

    <v-data-table
      :headers="headers"
      :items="categories"
      item-key="id"
      hide-default-footer
      class="elevation-2"
    >
      <template v-slot:item.color="{ item }">
        <v-chip
          :color="item.color"
          class="ma-2"
          dark
        >
          {{ item.color }}
        </v-chip>
      </template>
      <template v-slot:item.manage="{ item }">
        <v-btn
          @click="categoryData=item"
          icon
        >
          <v-icon color="blue">
            mdi-circle-edit-outline
          </v-icon>
        </v-btn>
        <v-btn
          @click="categoryDelete=item.id"
          icon
        >
          <v-icon color="red">
            mdi-trash-can-outline
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <EditCategory
      :category="categoryData"
    />
    <DeleteDialog
      :delete-id="categoryDelete"
      delete-type="categories"
    />
  </v-col>
</template>

<script>
import EditCategory from '~/components/admin/EditCategory'
import DeleteDialog from '~/components/admin/DeleteDialog'
// import Sortable from 'sortablejs'

export default {
  layout: 'admin',
  components: {
    EditCategory, DeleteDialog
  },
  data: () => ({
    selected: [],
    headers: [
      { text: 'Name', value: 'name', align: 'left', sortable: true },
      { text: 'Color', value: 'color', align: 'center', sortable: true },
      { text: 'Actions', value: 'manage', align: 'right', sortable: false }
    ],
    categoryData: false,
    categoryDelete: null
  }),
  computed: {
    categories () {
      return this.$store.state.categories.categories
    }
  },
  created () {
    this.$store.dispatch('categories/getCategories')

    this.$bus.$on('refresh', () => {
      this.categoryData = false
      this.categoryDelete = null
    })
  },
  mounted () {
    // const table = document.querySelector('.v-datatable tbody')
    // const Category = this

    /*
    Sortable.create(table, {
      group: 'localStorage-example',
      handle: '.handle',
      store: {
        set: function (sortable) {
          const order = sortable.toArray()
          Category.saveOrder(order)
        }
      }
    })
    */
  },
  methods: {
    /*
    saveOrder (sort) {
      const Category = this

      this.$axios.post('/api/admin/categories/sort',
        {
          order: sort
        }
      )
        .catch (function (error) {
          // Category.$emit('errorSnackbar')
        })
    }
    */
  }
}
</script>
