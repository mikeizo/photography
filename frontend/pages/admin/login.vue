<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-form @submit.prevent="login">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="username"
              prepend-icon="mdi-account"
              name="username"
              label="Username"
              type="text"
              required
            />
            <v-text-field
              id="password"
              v-model="password"
              prepend-icon="mdi-lock"
              name="password"
              label="Password"
              type="password"
              required
            />
            <v-alert
              v-if="alert"
              type="error"
            >
              Incorrect username or password
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="loading"
              color="primary"
              type="submit"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  components: { },
  data: () => ({
    username: '',
    password: '',
    loading: false,
    alert: false
  }),
  methods: {
    async login () {
      this.loading = true
      const payload = { username: this.username, password: this.password }

      try {
        await this.$auth.loginWith('local', {
          data: payload
        })
        this.$router.push('/admin/photos')
        this.alert = false
      } catch (error) {
        this.alert = true
      }
      this.loading = false
    }
  }
}
</script>
