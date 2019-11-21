<template>
  <v-snackbar
    v-model="snackbar"
    :multi-line="true"
    :timeout="5000"
    color="error"
  >
    Unauthorized
    <v-btn
      @click="snackbar = false"
      text
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false
  }),
  created () {
    this.$bus.$on('unauthorized', () => {
      this.snackbar = true
    })
  }
}
</script>
