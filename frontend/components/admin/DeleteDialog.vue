<template>
  <v-dialog
    v-if="deleteDialog"
    v-model="deleteDialog"
    max-width="225"
    persistent
  >
    <v-card class="text-center pa-2">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">
            Are You Sure?
          </v-list-item-title>
          <v-list-item-subtitle>
            Click delete to confirm
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <div class="mx-auto">
          <v-btn
            @click="deleteDialog=false"
            color="red"
            text
          >
            Cancel
          </v-btn>
          <v-btn
            @click="deleteAction()"
            :loading="loading"
            color="red"
            dark
          >
            Delete
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    deleteId: {
      type: [Number, Array],
      default: null
    },
    deleteType: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    deleteDialog: false,
    loading: false,
    payload: '',
    error: false
  }),
  watch: {
    deleteId (val) {
      this.payload = {
        value: this.deleteId,
        type: this.deleteType
      }
      this.deleteDialog = val
    },
    deleteDialog (val) {
      if (!val) {
        this.$bus.$emit('refresh')
      }
    }
  },
  methods: {
    deleteAction () {
      this.loading = true

      this.$store.dispatch(this.payload.type + '/delete', this.payload)
        .catch((error) => {
          console.log(error)
          this.$bus.$emit('unauthorized')
        })
        .finally(() => {
          this.deleteDialog = false
          this.loading = false
        })
    }
  }
}
</script>
