export const actions = {
  async nuxtServerInit ({ dispatch }, { req }) {
    await dispatch('settings/getSettings')
    await dispatch('categories/getCategories')
    await dispatch('photos/getPhotos')
  }
}
