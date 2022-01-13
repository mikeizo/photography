export default {
  state: () => ({
    photos: []
  }),

  mutations: {
    setPhotos(state, photos) {
      state.photos = photos
    },

    updatePhoto(state, val) {
      const index = state.photos.findIndex((x) => x._id === val._id)
      state.photos[index].title = val.title
      state.photos[index].category = val.category
    },

    deletePhoto(state, val) {
      if (Array.isArray(val)) {
        val.forEach((element) => {
          const index = state.photos.findIndex((x) => x._id === element._id)
          state.photos.splice(index, 1)
        })
      } else {
        const index = state.photos.findIndex((x) => x._id === val._id)
        state.photos.splice(index, 1)
      }
    }
  },

  actions: {
    async getPhotos(context) {
      return await this.$axios.get('/api/photos').then((res) => {
        context.commit('setPhotos', res.data)
      })
    },

    async updatePhotosCategory(context, category) {
      let filter = ''
      if (category) {
        filter = `?category=${category}`
      }
      return await this.$axios.get(`/api/photos${filter}`).then(function (res) {
        context.commit('setPhotos', res.data)
      })
    }
  }
}
