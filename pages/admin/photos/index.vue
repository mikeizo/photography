<template>
  <v-col cols="12">
    <h2 class="display-1 font-weight-light">Photos</h2>
    <!-- Table -->
    <v-data-table
      v-model="photosSelected"
      :headers="headers"
      :items="photos"
      :items-per-page="5"
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
        <v-chip
          v-for="(categoryName, index) in item.category"
          :key="index"
          dark
          class="mr-2"
          :color="getColor(categoryName)"
        >
          {{ categoryName }}
        </v-chip>
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
            deleteID = item._id
            deleteDialog = true
          "
        >
          <v-icon color="red">mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- DIALOG -->
    <EditPhoto :photo-data="photoData" />

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
          <v-btn
            :loading="loading"
            color="error"
            @click="deletePhoto(deleteID)"
          >
            Delete
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import EditPhoto from '~/components/admin/EditPhoto'

export default {
  components: { EditPhoto },
  layout: 'admin',
  data: () => ({
    awsUrl: process.env.awsS3,
    photoData: {},
    dialog: false,
    deleteDialog: false,
    deleteID: null,
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
    getColor(name) {
      if (this.categories.length) {
        const index = this.categories.findIndex((category) => {
          return name === category.name
        })

        if (index === -1) {
          return 'gray'
        } else {
          return this.categories[index].color
        }
      }
    },

    openDialog(data) {
      this.photoData = Object.assign({}, data)
      this.dialog = true
    },

    formatTime(time) {
      return time.format('MM/DD/YYYY')
    },

    async deletePhoto(id) {
      const Photos = this
      this.loading = true

      await this.$axios
        .delete(`api/photos/${id}`)
        .then(function (res) {
          Photos.$store.commit('photos/deletePhoto', id)
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
