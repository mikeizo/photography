<template>
  <section id="home">
    <v-parallax
      :src="`img/` + settings.home_photo"
      height="800"
    >
      <v-container bg fill-height grid-list-md text-xs-center>
        <v-row align-center>
          <v-col class="caption">
            <h1 class="display-3 text-center font-weight-light mb-3 mt-0">
              {{ settings.title }}
            </h1>
            <h2 class="display-1 text-center">
              {{ settings.subtitle }}
            </h2>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>
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

<style scoped lang="scss">
  .caption h1, .caption  h2 {
      text-shadow: 1px 1px 25px $black;
  }
  .border--white {
      border: 8px solid $white;
  }
</style>
