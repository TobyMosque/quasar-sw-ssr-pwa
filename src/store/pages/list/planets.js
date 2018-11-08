import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  namespaced: true,
  state: {
    filter: '',
    data: [],
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['diameter', 'gravity', 'population', 'surface_water']
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
      return rootGetters.db.rel.find('planets').then(({ planets }) => {
        commit('data', planets)
        return Promise.resolve()
      })
    },
    deletePlanet ({ state, commit, rootGetters }, planet) {
      return Dialog.create({
        title: 'Delete Planet',
        message: `Are you sure to delete the planet ${planet.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('planet', planet)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === planet.id)
        commit('remoteItem', index)
        Notify.create({ message: `Planet ${planet.name} deleted!`, color: 'primary' })
      })
    }
  }
}
