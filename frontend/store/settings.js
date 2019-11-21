export const state = () => ({
  settings: null
})

export const mutations = {
  setSettings (state, settings) {
    state.settings = settings
  },
  updateSettings (state, settings) {
    state.settings[settings.name] = settings.value
  }
}

export const actions = {
  setSettings (state, settings) {
    state.settings = settings
  },
  getSettings (context) {
    return this.$axios.get('settings')
      .then((response) => {
        context.commit('setSettings', response.data)
      })
  }
}

export const getters = {
  getSettings (state) {
    return state.settings
  }
}
