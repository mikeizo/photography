export default {
  state: () => ({
    contactDialog: false,
    settings: [],
    snackbar: {
      show: false,
      message: '',
      color: ''
    }
  }),

  mutations: {
    toggleDialog(state) {
      state.contactDialog = !state.contactDialog
    },
    setDialog(state, value) {
      state.contactDialog = value
    },
    setSettings(state, value) {
      state.settings = value
    },
    setSnackbar(state, value) {
      state.snackbar = value
    }
  },

  actions: {
    setDialog(context, value) {
      context.commit('setDialog', value)
    },
    async getSettings(context) {
      return await this.$axios.get('/api/settings').then((res) => {
        context.commit('setSettings', res.data)
      })
    }
  }
}
