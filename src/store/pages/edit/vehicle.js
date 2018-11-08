import { uid, Notify } from 'quasar'
import Vue from 'vue'

let data = {
  id: uid(),
  rev: '',
  name: '',
  model: '',
  vehicle_class: '',
  manufacturer: '',
  cost_in_credits: '',
  length: '',
  crew: '',
  passengers: '',
  max_atmosphering_speed: '',
  cargo_capacity: '',
  consumables: '',
  pilots: [],
  films: [],
  created: null,
  edited: null
}
let options = {
  pilots: [],
  films: []
}
let selected = {
  pilots: [],
  films: []
}

export default {
  namespaced: true,
  state: {
    data: { ...data },
    options: { ...options },
    selected: { ...selected }
  },
  mutations: {
    data (state, value) { Vue.set(state, 'data', value) },
    options (state, value) { Vue.set(state, 'options', value) },
    selected (state, value) { Vue.set(state, 'selected', value) },
    created (state, value) { Vue.set(state.data, 'created', value ? value.toISOString() : null) },
    edited (state, value) { Vue.set(state.data, 'edited', value ? value.toISOString() : null) }
  },
  actions: {
    init ({ commit, rootGetters }, id) {
      commit('data', { ...data })
      commit('selected', { ...selected })
      var _options = {}
      var promise = Promise.all([
        rootGetters.db.rel.find('film').then(({ films }) => {
          _options.films = films.map(film => ({ value: film.id, label: film.title }))
        }),
        rootGetters.db.rel.find('person').then(({ people }) => {
          _options.pilots = people.map(person => ({ value: person.id, label: person.name }))
        })
      ]).then(() => {
        commit('options', _options)
      })
      if (!id) {
        return promise
      }
      return promise.then(() => {
        return rootGetters.db.rel.find('vehicle', [ id ])
      }).then(({ vehicles }) => {
        if (vehicles[0]) {
          commit('data', vehicles[0])
        } else if (process.env.MODE !== 'ssr') {
          this.$router.replace({ name: 'not_found' })
        }
      })
    },
    saveVehicle ({ state, commit, getters, rootGetters }) {
      if (!getters.created) {
        commit('created', new Date())
      }
      commit('edited', new Date())
      rootGetters.db.rel.save('vehicle', state.data).then(() => {
        Notify.create({ message: `Vehicle ${state.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  },
  getters: {
    created (state) { return state.data.created ? new Date(state.data.created) : null },
    edited (state) { return state.data.edited ? new Date(state.data.edited) : null }
  }
}
