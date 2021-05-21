export default {
  state: () => ({
    contactDialog: false,
    settings: []
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
