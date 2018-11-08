import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  namespaced: true,
  state: {
    filter: '',
    data: [],
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['model', 'starship_class', 'manufacturer', 'crew', 'passengers']
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
      return rootGetters.db.rel.find('starship').then(({ starships }) => {
        commit('data', starships)
        return Promise.resolve()
      })
    },
    deleteStarship ({ state, commit, rootGetters }, starship) {
      return Dialog.create({
        title: 'Delete Starship',
        message: `Are you sure to delete the starship ${starship.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('starship', starship)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === starship.id)
        commit('remoteItem', index)
        Notify.create({ message: `Starship ${starship.name} deleted!`, color: 'primary' })
      })
    }
  }
}
