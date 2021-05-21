export default {
  state: () => ({
    categories: [],
    colors: [
      'black',
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey'
    ]
  }),

  mutations: {
    setCategories(state, categories) {
      state.categories = categories
    },

    updateCategory(state, val) {
      const index = state.categories.findIndex((x) => x._id === val._id)
      state.categories[index].name = val.name
      state.categories[index].color = val.color
    },

    deleteCategory(state, val) {
      const index = state.categories.findIndex((x) => x._id === val)
      state.categories.splice(index, 1)
    }
  },

  actions: {
    async getCategories(context) {
      return await this.$axios.get('/api/categories').then((res) => {
        context.commit('setCategories', res.data)
      })
    }
  }
}
