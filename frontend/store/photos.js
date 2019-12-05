export const state = () => ({
  photos: null
})

export const mutations = {
  setPhotos (state, photos) {
    state.photos = photos
  },
  updatePhoto (state, photo) {
    state.photos[photo.id].categories = photo.categories

    if (photo.title) {
      state.photos[photo.id].title = photo.title
    }
  },
  deletePhoto (state, id) {
    const photoId = state.photos.findIndex(
      photo => photo.id === id
    )
    state.photos.splice(photoId, 1)
  }
}

export const actions = {
  getPhotos (context) {
    return this.$axios.get('photos')
      .then((response) => {
        context.commit('setPhotos', response.data)
      })
  },
  updatePhotos (context, photo) {
    const categoriesArr = []

    photo.photos.forEach(function (val, index) {
      const photoId = context.state.photos.findIndex(
        x => x.id === val.id
      )

      photo.categories.forEach(function (val, index) {
        categoriesArr[index] = { 'id': val }
      })

      const data = {
        'id': photoId,
        'categories': categoriesArr,
        'title': val.title
      }

      context.commit('updatePhoto', data)
    })
  },
  updatePhotosCategory (context, photos) {
    context.commit('setPhotos', photos)
  },
  delete (context, photo) {
    return this.$axios.delete('admin/' + photo.type + '/' + photo.value,
      {
        headers: {
          'Authorization': this.$cookies.get('auth._token.local')
        }
      })
      .then((response) => {
        context.commit('deletePhoto', photo.value)
      })
  },
  deletePhotos (context, photo) {
    photo.photos.forEach(function (val, index) {
      context.commit('deletePhoto', val.id)
    })
  }
}

export const getters = {
  getPhotos (state) {
    return state.photos
  }
}
