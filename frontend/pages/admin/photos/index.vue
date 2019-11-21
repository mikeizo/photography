<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Photos
    </h2>

    <!-- Bulk Actions -->
    <!--
    <v-speed-dial
      v-model="fab"
      absolute
      right
      direction="left"
      transition="scale-transition"
    >
      <template v-slot:activator>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-model="fab"
              fab
              dark
              color="green"
              v-on="on"
            >
              <v-icon v-if="fab">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Bulk Actions</span>
        </v-tooltip>
      </template>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="blue"
            @click="bulkAction='Update'"
            v-on="on"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit Categories</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="red"
            @click="bulkAction='Delete'"
            v-on="on"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete Photos</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="gray"
            @click="bulkAction=false"
            v-on="on"
          >
            <v-icon>mdi-notification-clear-all</v-icon>
          </v-btn>
        </template>
        <span>
          Clear
        </span>
      </v-tooltip>
    </v-speed-dial>

    <v-divider class="my-3" />

    <v-expand-transition>
      <v-row
        v-show="bulkAction=='Update'"
        mb-3
        row
        wrap
        style="white-space: nowrap"
      >
        <v-btn
          :loading="loading"
          color="green"
          dark
          large
        >
          Update
        </v-btn>
        <v-row wrap mt-0>
          <v-flex
            v-for="(category, index) in categories"
            :key="index"
            xs3
            sm2
            class="bulk-categories"
          >
            <v-checkbox
              v-model="categoriesSelected"
              :label="category.name"
              :color="category.color"
              :value="category.id"
              hide-details
            />
          </v-flex>
        </v-row>
      </v-row>
    </v-expand-transition>

    <v-expand-transition>
      <v-row
        v-show="bulkAction=='Delete'"
        mb-3
        row
        wrap
      >
        <v-btn
          color="red"
          dark
          large
          @click="photoDelete=photosSelected; type='photos';"
        >
          Delete
        </v-btn>
      </v-row>
    </v-expand-transition>
    -->

    {{ categories.id }}
    <!-- Table -->
    <v-data-table
      v-model="photosSelected"
      :headers="headers"
      :items="photos"
      :items-per-page="30"
      item-key="id"
      show-select
      class="elevation-2"
    >
      <template v-slot:item.filename="{ item }">
        <v-img
          :src="`/img/photos/thumbs/` + item.filename"
          height="75"
          max-width="75"
          contain
          class="my-3"
        >
          <template v-slot:placeholder>
            <v-row align-center justify-center>
              <v-progress-circular indeterminate color="grey lighten-2" />
            </v-row>
          </template>
        </v-img>
      </template>

      <template v-slot:item.categories="{ item }">
        <div
          v-for="category in item.categories"
          :key="category.id"
          class="d-inline-flex"
        >
          <v-chip
            v-if="categories[category.id]"
            :color="categories[category.id].color"
            dark
            class="mr-3"
          >
            {{ categories[category.id].name }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.manage="{ item }">
        <v-btn
          @click="photoData=item"
          icon
        >
          <v-icon color="blue">
            mdi-circle-edit-outline
          </v-icon>
        </v-btn>
        <v-btn
          @click="photoDelete=item.id"
          icon
        >
          <v-icon color="red">
            mdi-trash-can-outline
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <EditPhoto
      :photo="photoData"
    />
    <DeleteDialog
      :delete-id="photoDelete"
      delete-type="photos"
    />
  </v-col>
</template>

<script>
import EditPhoto from '~/components/admin/EditPhoto'
import DeleteDialog from '~/components/admin/DeleteDialog'

export default {
  layout: 'admin',
  components: {
    EditPhoto, DeleteDialog
  },
  data: () => ({
    loading: false,
    headers: [
      { text: 'Photo', value: 'filename', align: 'left', sortable: false },
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Categories', value: 'categories', align: 'center', sortable: false },
      { text: 'Actions', value: 'manage', align: 'right', sortable: false }
    ],

    bulkAction: '',
    bulkList: ['', 'Delete', 'Update'],
    error: false,
    expand: false,
    fab: false,
    categoriesSelected: [],
    photoData: false,
    photoDelete: null,
    type: '',
    photosSelected: []
  }),
  computed: {
    photos () {
      return this.$store.state.photos.photos
    },
    categories () {
      const categories = this.$store.state.categories.categories
      const categoryArray = []

      for (const index in categories) {
        categoryArray[categories[index].id] = categories[index]
      }

      return categoryArray
    }
  },
  created () {
    this.$store.dispatch('photos/getPhotos')

    this.$bus.$on('refresh', () => {
      this.photoData = false
      this.photoDelete = null
    })
  },
  methods: {
    /*
    updatePhotos() {
      this.loading=true
      this.$store.dispatch('updateCategories', {
        photos: this.photosSelected,
        categories: this.categoriesSelected,
      })
      .catch(() => {
        this.error=true
      })
      .finally(() => {
        this.loading=false
      })
    },
    refresh() {
      this.photoData=false
      this.photoDelete=null
    },
    errorSnackbar() {
      this.error=true
    } */
  }
}
</script>
