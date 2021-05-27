<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackbar" :color="color">
      {{ message }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    timeout: 5000
  }),

  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar.show
      },
      set() {
        this.$store.commit('setSnackbar', { show: false })
      }
    },
    message() {
      return this.$store.state.snackbar.message
    },
    color() {
      return this.$store.state.snackbar.color
    }
  }
}
</script>
