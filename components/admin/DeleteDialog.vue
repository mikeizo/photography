<template>
  <v-dialog :value="deleteDialog" persistent max-width="500px">
    <v-card class="pa-2">
      <v-card-title class="h4">
        <v-spacer></v-spacer>
        <slot></slot>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="confirm(false)">Cancel</v-btn>
        <v-btn :loading="loading" color="error" @click="confirm(true)">
          Delete
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    deleteDialog: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    confirm(value) {
      this.$emit('deleteInput', value)
    }
  }
}
</script>
