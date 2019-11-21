export const state = () => ({
  photos: null
})

export const mutations = {
  setPhotos (state, photos) {
    state.photos = photos
  },
  updatePhoto (state, photoData) {
    const categories = []
    // Find Id of photo
    const photoId = state.photos.findIndex(
      photo => photo.id === photoData.id
    )
    // Format data
    photoData.categories.forEach(function (val, index) {
      categories[index] = { 'id': val }
    })

    state.photos[photoId].title = photoData.title
    state.photos[photoId].categories = categories
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
  updatePhoto (context, photo) {
    context.commit('updatePhoto', photo)
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
  }
}

export const getters = {
  getPhotos (state) {
    return state.photos
  }
}
