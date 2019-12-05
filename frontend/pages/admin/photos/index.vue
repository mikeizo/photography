<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light mb-5">
      Photos
    </h2>

    <v-alert
      :value="alert"
      :type="alert_type"
      dismissible
      transition="fade-transition"
    >
      {{ alert_message }}
    </v-alert>

    <!-- Bulk Actions -->
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
              v-on="on"
              color="green"
              fab
              dark
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
            @click="bulkAction='Update'"
            v-on="on"
            color="blue"
            fab
            dark
            small
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit Categories</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="bulkAction='Delete'"
            v-on="on"
            color="red"
            fab
            dark
            small
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete Photos</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="bulkAction=false"
            v-on="on"
            color="gray"
            fab
            dark
            small
          >
            <v-icon>mdi-notification-clear-all</v-icon>
          </v-btn>
        </template>
        <span>
          Clear
        </span>
      </v-tooltip>
    </v-speed-dial>

    <v-expand-transition>
      <v-row v-show="bulkAction=='Update'">
        <v-col
          cols="12"
          class="d-flex mb-5"
        >
          <v-btn
            @click="updatePhotos"
            :loading="loading"
            color="green"
            class="mr-5"
            dark
            large
          >
            Update
          </v-btn>
          <div
            v-for="category in this.$store.state.categories.categories"
            :key="category.id"
          >
            <v-checkbox
              v-model="categoriesSelected"
              :label="category.name"
              :color="category.color"
              :value="category.id"
              hide-details
              class="mr-5"
            />
          </div>
        </v-col>
      </v-row>
    </v-expand-transition>

    <v-expand-transition>
      <v-row v-show="bulkAction=='Delete'">
        <v-col
          cols="12"
          class="d-flex mb-5"
        >
          <v-btn
            @click="deletePhotos"
            :loading="loading"
            color="red"
            dark
            large
          >
            Delete
          </v-btn>
        </v-col>
      </v-row>
    </v-expand-transition>

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
    headers: [
      { text: 'Photo', value: 'filename', align: 'left', sortable: false },
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Categories', value: 'categories', align: 'center', sortable: false },
      { text: 'Actions', value: 'manage', align: 'center', sortable: false }
    ],
    photoData: false,
    photoDelete: null,
    // bulk edit
    fab: false,
    loading: false,
    bulkAction: '',
    categoriesSelected: [],
    photosSelected: [],
    alert: false,
    alert_message: null,
    alert_type: null
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
    async updatePhotos () {
      const Category = this
      this.loading = true

      const payload = {
        photos: this.photosSelected,
        categories: this.categoriesSelected
      }

      await this.$axios.post('admin/update-categories',
        payload,
        {
          headers: {
            'Authorization': this.$cookies.get('auth._token.local')
          }
        })
        .then(function (response) {
          Category.$store.dispatch('photos/updatePhotos', payload)
          Category.alert_type = 'success'
          Category.alert_message = 'Categories have been updated'
        })
        .catch(function (error) {
          Category.alert_type = 'error'
          Category.alert_message = error.response.data.message
        })
        .finally(() => {
          Category.loading = false
          Category.alert = true
          Category.photosSelected = []
        })
    },
    async deletePhotos () {
      const Photos = this
      this.loading = true

      const payload = {
        photos: this.photosSelected
      }
      await this.$axios.post('admin/delete-photos',
        payload,
        {
          headers: {
            'Authorization': this.$cookies.get('auth._token.local')
          }
        })
        .then(function (response) {
          Photos.$store.dispatch('photos/deletePhotos', payload)
          Photos.alert_type = 'success'
          Photos.alert_message = 'Photos have been deleted'
        })
        .catch(function (error) {
          Photos.alert_type = 'error'
          Photos.alert_message = error.response.data.message
        })
        .finally(() => {
          Photos.loading = false
          Photos.alert = true
          Photos.photosSelected = []
        })
    }
  }
}
</script>
