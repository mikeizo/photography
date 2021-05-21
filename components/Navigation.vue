<template>
  <section class="navigation">
    <v-app-bar fixed color="white" elevate-on-scroll>
      <v-toolbar-title @click="$vuetify.goTo('#home', options)">
        Steve L. Photography
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="green" plain @click.stop="drawer = !drawer">
        <v-icon left>mdi-menu</v-icon>
        Menu
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      right
      dark
      :width="width"
    >
      <div class="nav-menu">
        <ul>
          <li v-for="(item, index) in menuItems" :key="index">
            <a
              class="display-2 font-weight-thin"
              @click="scrollTo(item.target)"
              >{{ item.title }}</a
            >
          </li>
          <li>
            <a class="display-2 font-weight-thin" @click="openDialog">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </v-navigation-drawer>
  </section>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        { title: 'Home', target: '#home' },
        { title: 'About', target: '#about' },
        { title: 'Photos', target: '#photos' }
      ],
      // Smooth Scroll
      options: {
        duration: 2000,
        offset: 50,
        easing: 'easeOutQuint'
      }
    }
  },
  computed: {
    width() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return '50%'
      }
      return '80%'
    }
  },

  methods: {
    openDialog() {
      this.$store.dispatch('setDialog', true)
      this.drawer = false
    },

    scrollTo(target) {
      this.$vuetify.goTo(target, this.options)
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  font-family: 'Italianno', cursive;
  font-size: 2.5rem;
  @media only screen and (max-width: 500px) {
    font-size: 1.8rem;
  }
}

.nav-menu {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 50%;
    text-align: center;
    li {
      &:not(:last-child) {
        border-bottom: 1px solid darken($white, 30%);
      }
      a {
        color: $white;
        display: block;
        padding: 40px 0;
      }
    }
  }
}
</style>
