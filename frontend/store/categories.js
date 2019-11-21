export const state = () => ({
  categories: null,
  colors: ['black', 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']
})

export const mutations = {
  setCategories (state, categories) {
    state.categories = categories
  },
  updateCategory (state, categoryData) {
    const categoryId = state.categories.findIndex(
      category => category.id === categoryData.id
    )

    state.categories[categoryId][categoryData.name] = categoryData.value
  },
  addCategory (state, category) {
    state.categories.push(category)
  },
  deleteCategory (state, id) {
    const categoryId = state.categories.findIndex(
      category => category.id === id
    )

    state.categories.splice(categoryId, 1)
  }
}

export const actions = {
  getCategories (context) {
    return this.$axios.get('categories')
      .then((response) => {
        context.commit('setCategories', response.data)
      })
  },
  setCategories (context, categories) {
    context.commit('setCategories', categories)
  },
  updateCategory (context, category) {
    context.commit('updateCategory', category)
  },
  addCategory (context, category) {
    context.commit('addCategory', category)
  },
  delete (context, category) {
    return this.$axios.delete('admin/' + category.type + '/' + category.value,
      {
        headers: {
          'Authorization': this.$cookies.get('auth._token.local')
        }
      })
      .then((response) => {
        context.commit('deleteCategory', category.value)
      })
  }
}

export const getters = {
  getCategories (state) {
    return state.getCategories
  }
}
