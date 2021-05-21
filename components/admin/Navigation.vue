<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      width="275"
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
            <template #activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
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
                <v-list-item-title>{{ child.text }}</v-list-item-title>
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      color="primary"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu
        offset-y
        content-class="dropdown-menu"
        transition="slide-y-transition"
      >
        <template #activator="{ on }">
          <v-btn icon v-on="on">
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
        icon: 'mdi-cog'
      },
      {
        path: '/',
        text: 'Back to Site',
        icon: 'mdi-exit-to-app'
      }
    ]
  }),
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>
