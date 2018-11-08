import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  namespaced: true,
  state: {
    filter: '',
    data: [],
    planets: {},
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['classification', 'designation', 'language', 'homeworld']
  },
  mutations: {
    filter (state, value) { Vue.set(state, 'filter', value) },
    data (state, value) { Vue.set(state, 'data', value) },
    planets (state, value) { Vue.set(state, 'planets', value) },
    rowsPerPage (state, value) { Vue.set(state, 'rowsPerPage', value) },
    pagination (state, value) { Vue.set(state, 'pagination', value) },
    visibleColumns (state, value) { Vue.set(state, 'visibleColumns', value) },
    remoteItem (state, index) { state.data.splice(index, 1) }
  },
  actions: {
    init ({ commit, rootGetters }) {
      return rootGetters.db.rel.find('species').then(({ species }) => {
        commit('data', species)
        return rootGetters.db.rel.find('planet')
      }).then(({ planets }) => {
        planets = planets.reduce((planets, planet) => {
          planets[planet.id] = planet.name
          return planets
        }, {})
        commit('planets', planets)
        return Promise.resolve()
      })
    },
    deleteSpecies ({ state, commit, rootGetters }, species) {
      return Dialog.create({
        title: 'Delete Species',
        message: `Are you sure to delete the species ${species.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('species', species)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === species.id)
        commit('remoteItem', index)
        Notify.create({ message: `Species ${species.name} deleted!`, color: 'primary' })
      })
    }
  }
}
