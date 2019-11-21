<template>
  <v-dialog
    v-model="dialog"
    max-width="750px"
    dark
  >
    <v-card class="pa-5">
      <v-container class="pt-0">
        <v-list-item class="px-0">
          <v-list-item-content>
            <v-list-item-title class="headline">
              Contact Form
            </v-list-item-title>
          </v-list-item-content>
          <v-spacer />
          <v-btn
            @click="dialog=false"
            color="white"
            fab
            small
          >
            <v-icon color="black">
              mdi-close
            </v-icon>
          </v-btn>
        </v-list-item>
      </v-container>

      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-container class="py-0">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                maxlength="50"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="comments"
                name="input-7-4"
                label="Comments"
                color="green"
                filled
              />
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions class="pt-0">
          <p v-if="errors" class="red--text">
            {{ errors }}
          </p>
          <p v-if="success" class="green--text">
            {{ success }}
          </p>
          <v-spacer />
          <v-btn
            @click="submit"
            :loading="loading"
            color="green"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data: () => ({
    dialog: false,
    loading: false,
    valid: true,
    errors: '',
    success: '',
    // Form variables
    lazy: false,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 50) || 'Name must be less than 50 characters',
      v => (v && v.length >= 2) || 'Name must be greater than 2 characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      // v => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,4})+$/.test(v) || 'E-mail must be valid'
    ],
    comments: ''
  }),
  created () {
    this.$bus.$on('open-contact', () => {
      this.dialog = true
    })
  },
  methods: {
    submit () {
      this.loading = true
      const Form = this

      // Validate form
      if (this.$refs.form.validate()) {
        // Post form input
        this.$axios.post('contact', {
          name: this.name,
          email: this.email,
          comments: this.comments
        })
          .catch(function (error) {
            console.log(error)
            Form.errors = 'Please fill out all required fields'
            Form.loading = false
          })
          .then(function (response) {
            if (response && response.status === 200) {
              Form.success = 'Your form has been submitted. Thank You!'
              Form.errors = null
              Form.loading = false
              Form.$refs.form.reset()
            }
          })
      } else {
        this.success = null
        Form.loading = false
      }
    }
  }
}
</script>
