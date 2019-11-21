<template>
  <section id="about" class="grey darken-4 white--text py-10">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-img
              :src="`img/` + settings.about_photo"
              class="border--white"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="green lighten-5" />
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>
        <v-col cols="12" sm="5" md="7" class="font-weight-light">
          <h2 class="display-2 font-weight-thin">
            About
          </h2>
          <v-divider class="my-4" dark />
          <span v-html="settings.about" />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>

export default {
  computed: {
    settings () {
      return this.$store.state.settings.settings
    }
  }
}
</script>
