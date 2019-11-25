<template>
  <section class="navigation">
    <v-toolbar light>
      <v-toolbar-title @click="$vuetify.goTo('#home' , options)">
        Steve L. Photography
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          @click="$vuetify.goTo(item.route, options)"
          v-for="item in menuItems"
          :key="item.title"
          color="green"
          text
        >
          {{ item.title }}
        </v-btn>
        <v-btn
          @click="$bus.$emit('open-contact')"
          color="green"
          text
        >
          Contact
        </v-btn>
      </v-toolbar-items>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      />
    </v-toolbar>

    <!-- Mobile Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      right
      light
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          @click="$vuetify.goTo(item.route, options); drawer = false"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$bus.$emit('open-contact'); drawer = false">
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </section>
</template>

<script>

export default {

  data () {
    return {
      // Navigation Draw
      drawer: null,
      mini: false,
      // Navigation Menu
      menuItems: [
        { title: 'Home', route: '#home', icon: 'mdi-home' },
        { title: 'About', route: '#about', icon: 'mdi-information' },
        { title: 'Photos', route: '#photos', icon: 'mdi-image' }
      ],
      // Smooth Scroll
      duration: 2000,
      offset: 50,
      easing: 'easeOutQuint'
    }
  },
  computed: {
    options () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .navigation {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
  }
  .theme--light.v-toolbar {
    background-color: rgba(255,255,255, 0.9);
  }
  .v-toolbar__title {
    font-family: 'Italianno', cursive;
    font-size: 2.5rem !important;
  }
  .nav-drawer--custom {
    border-bottom: 1px solid lighten($black, 90%);
  }
  .v-list--dense .v-list__tile .v-icon,
  .v-list--dense .v-list__tile {
    font-size: 24px;
    color: $black;
  }
  .v-list--dense .v-list__tile:not(.v-list__tile--avatar) {
    height: 60px;
  }
</style>
