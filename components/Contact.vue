<template>
  <v-dialog
    v-model="contactDialog"
    width="750"
    dark
    @click:outside="closeDialog"
  >
    <v-card class="pa-5">
      <v-container class="pt-0">
        <v-list-item class="px-0">
          <v-list-item-content>
            <v-list-item-title class="headline">
              Contact Form
            </v-list-item-title>
            <v-list-item-subtitle>
              Please fill out the form below
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer />
          <v-btn small fab color="white">
            <v-icon color="black" @click="closeDialog">mdi-close</v-icon>
          </v-btn>
        </v-list-item>
      </v-container>

      <v-form ref="contactForm" v-model="valid" lazy-validation>
        <v-container class="py-0">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                maxlength="50"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="comments"
                name="input-7-4"
                label="Comments"
                filled
              />
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions class="pt-0">
          <p v-if="message" class="green--text mr-10">{{ message }}</p>
          <v-spacer />
          <v-btn :loading="loading" color="green" @click="submitForm">
            Send <v-icon right dark>mdi-send</v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    valid: true,
    message: '',
    // Form variables and validation rules
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 50) || 'Name must be less than 50 characters',
      (v) => (v && v.length >= 1) || 'Name must be greater than 3 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      // v => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,4})+$/.test(v) || 'E-mail must be valid'
    ],
    comments: ''
  }),

  computed: {
    contactDialog() {
      return this.$store.state.contactDialog
    }
  },

  methods: {
    closeDialog() {
      this.$store.dispatch('setDialog', false)
    },

    async submitForm() {
      // Validate form
      if (this.$refs.contactForm.validate()) {
        this.loading = true
        const Form = this
        const postData = {
          name: this.name,
          email: this.email,
          comments: this.comments
        }

        // Post form input
        await this.$axios
          .post(`/api/settings/contact`, postData)
          .then(function (res) {
            Form.message = 'Your form has been submitted. Thank You!'
            Form.$refs.contactForm.reset()
          })
          .catch(function () {
            Form.message =
              'There was an error sending your message. Please try again'
          })
          .finally(function () {
            Form.loading = false
          })
      }
    }
  }
}
</script>
