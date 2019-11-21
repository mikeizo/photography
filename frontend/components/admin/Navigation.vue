<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      dark
      app
    >
      <v-list shaped dense>
        <template v-for="item in items">
          <v-list-group
            v-if="item.children"
            :key="item.title"
            :prepend-icon="item.icon"
            no-action
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(child, index) in item.children"
              :key="index"
              :to="child.path"
              exact
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :key="item.text"
            v-model="item.model"
            :to="item.path"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Back to site</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="primary"
      dark
      app
    >
      <v-toolbar-title>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Admin</span>
      </v-toolbar-title>

      <div class="flex-grow-1" />

      <v-menu
        offset-y
        content-class="dropdown-menu"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      {
        text: 'Photos',
        icon: 'mdi-image',
        children: [
          {
            path: '/admin/photos',
            text: 'List Photos',
            icon: 'mdi-format-list-bulleted-square'
          },
          {
            path: '/admin/photos/add',
            text: 'Add Photos',
            icon: 'mdi-plus'
          }
        ]
      },
      {
        text: 'Categories',
        icon: 'mdi-shape',
        children: [
          {
            path: '/admin/categories',
            text: 'List Categories',
            icon: 'mdi-format-list-bulleted-square'
          },
          {
            path: '/admin/categories/add',
            text: 'Add Category',
            icon: 'mdi-plus'
          }
        ]
      },
      {
        path: '/admin/settings',
        text: 'Settings',
        icon: 'mdi-settings'
      }
    ]
  }),
  methods: {
    async logout () {
      await this.$auth.logout()
      this.$router.push('/admin/login')
    }
  }
}
</script>
