<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-form @submit.prevent="submit">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="login.username"
              prepend-icon="mdi-account"
              name="username"
              label="Username"
              type="text"
              required
            />
            <v-text-field
              v-model="login.password"
              prepend-icon="mdi-lock"
              name="password"
              label="Password"
              type="password"
              required
            />
            <v-alert v-if="alert" type="error">
              Incorrect username or password
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="loading" color="primary" type="submit">
              Login
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},
  data: () => ({
    loading: false,
    alert: false,
    login: {
      username: '',
      password: ''
    }
  }),
  methods: {
    async submit() {
      this.loading = true

      try {
        await this.$auth.loginWith('local', {
          data: this.login
        })
        this.alert = false
      } catch (error) {
        this.alert = true
      }

      this.loading = false
    }
  }
}
</script>
