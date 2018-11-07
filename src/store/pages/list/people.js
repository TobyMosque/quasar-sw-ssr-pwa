import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  registered: false,
  namespaced: true,
  state: {
    filter: '',
    data: [],
    planets: {},
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['birth_year', 'gender', 'height', 'mass']
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
      return rootGetters.db.rel.find('person').then(({ people }) => {
        commit('data', people)
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
    deletePerson ({ state, commit, rootGetters }, person) {
      return Dialog.create({
        title: 'Delete Person',
        message: `Are you sure to delete the person ${person.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('person', person)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === person.id)
        commit('remoteItem', index)
        Notify.create({ message: `Person ${person.name} deleted!`, color: 'primary' })
      })
    }
  }
}
