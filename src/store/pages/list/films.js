import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  registered: false,
  namespaced: true,
  state: {
    filter: '',
    data: [],
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['episode_id', 'director', 'producer_0', 'release_date']
  },
  mutations: {
    filter (state, value) { Vue.set(state, 'filter', value) },
    data (state, value) { Vue.set(state, 'data', value) },
    rowsPerPage (state, value) { Vue.set(state, 'rowsPerPage', value) },
    pagination (state, value) { Vue.set(state, 'pagination', value) },
    visibleColumns (state, value) { Vue.set(state, 'visibleColumns', value) },
    remoteItem (state, index) { state.data.splice(index, 1) }
  },
  actions: {
    init ({ commit, rootGetters }) {
      return rootGetters.db.rel.find('films').then(({ films }) => {
        commit('data', films)
        return Promise.resolve()
      })
    },
    deleteFilm ({ state, commit, rootGetters }, film) {
      return Dialog.create({
        title: 'Delete Film',
        message: `Are you sure to delete the film ${film.title}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('film', film)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === film.id)
        commit('remoteItem', index)
        Notify.create({ message: `Film ${film.title} deleted!`, color: 'primary' })
      })
    }
  }
}
