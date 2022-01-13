<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="auto" class="mr-auto">
        <h2 class="display-1 font-weight-light">Photos</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn
          v-if="photosSelected.length"
          elevation="2"
          color="error"
          @click="
            deleteData = photosSelected
            deleteDialog = true
          "
        >
          Delete
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-data-table
      v-model="photosSelected"
      :headers="headers"
      :items="photos"
      :items-per-page="10"
      item-key="_id"
      show-select
      :footer-props="{
        itemsPerPageOptions: [5, 10, 25, 50, 100, -1]
      }"
    >
      <template #item.filename="{ item }">
        <v-img
          :src="`${awsUrl}/photos/${item.filename}`"
          height="75"
          max-width="75"
          contain
          class="my-3"
        >
          <template #placeholder>
            <v-row align-center justify-center>
              <v-progress-circular indeterminate color="grey lighten-2" />
            </v-row>
          </template>
        </v-img>
      </template>
      <template #item.category="{ item }">
        <CategoryChip
          v-for="(id, index) in item.category"
          :key="index"
          :category-data="getCategory(id)"
        />
      </template>
      <template #item.created_at="{ item }">
        {{ item.created_at }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon @click="openDialog(item)">
          <v-icon color="blue">mdi-circle-edit-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="
            deleteData = item
            deleteDialog = true
          "
        >
          <v-icon color="red">mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- DIALOG -->
    <EditPhoto :photo-data="photoData" />

    <DeleteDialog
      :delete-dialog="deleteDialog"
      :loading="loading"
      @deleteInput="closeDeleteDialog"
    >
      Are you sure you want to delete?
    </DeleteDialog>
  </v-col>
</template>

<script>
import CategoryChip from '~/components/admin/CategoryChip'
import EditPhoto from '~/components/admin/EditPhoto'
import DeleteDialog from '~/components/admin/DeleteDialog'

export default {
  components: { CategoryChip, EditPhoto, DeleteDialog },
  layout: 'admin',
  data: () => ({
    awsUrl: process.env.awsS3,
    photoData: {},
    dialog: false,
    deleteDialog: false,
    deleteData: {},
    headers: [
      { text: 'Photo', value: 'filename', align: 'left', sortable: false },
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Category', value: 'category', align: 'center', sortable: false },
      { text: 'DateAdded', value: 'created_at', align: 'left', sortable: true },
      { text: 'Actions', value: 'actions', align: 'center', sortable: false }
    ],

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
    photos() {
      return this.$store.state.photos.photos
    },
    categories() {
      return this.$store.state.categories.categories
    }
  },

  created() {
    this.$store.dispatch('photos/getPhotos')
    this.$store.dispatch('categories/getCategories')
  },

  methods: {
    getCategory(id) {
      if (this.categories.length) {
        const category = this.categories.find((cat) => {
          return id === cat._id
        })

        return category
      }
    },

    openDialog(data) {
      this.photoData = Object.assign({}, data)
      this.dialog = true
    },

    closeDeleteDialog(value) {
      if (value) {
        this.deletePhoto(this.deleteData)
      } else {
        this.deleteDialog = false
      }
    },

    formatTime(time) {
      return time.format('MM/DD/YYYY')
    },

    async deletePhoto(photoData) {
      const Photos = this
      this.loading = true

      await this.$axios
        .post(`api/photos/delete`, photoData)
        .then(function (res) {
          Photos.$store.commit('photos/deletePhoto', photoData)
        })
        .finally(() => {
          Photos.loading = false
          Photos.deleteDialog = false
        })
    }
  }
}
</script>

<style>
.v-card__text,
.v-card__title {
  word-break: normal;
}
</style>
