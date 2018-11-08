import { uid, Notify } from 'quasar'
import Vue from 'vue'

let data = {
  id: uid(),
  rev: '',
  name: '',
  classification: '',
  designation: '',
  average_height: '',
  average_lifespan: '',
  eye_colors: '',
  hair_colors: '',
  skin_colors: '',
  language: '',
  homeworld: '',
  people: [],
  films: [],
  created: null,
  edited: null
}
let options = {
  people: [],
  films: [],
  planets: []
}
let selected = {
  people: [],
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
        rootGetters.db.rel.find('person').then(({ people }) => {
          _options.people = people.map(person => ({ value: person.id, label: person.name }))
        }),
        rootGetters.db.rel.find('film').then(({ films }) => {
          _options.films = films.map(film => ({ value: film.id, label: film.title }))
        }),
        rootGetters.db.rel.find('planet').then(({ planets }) => {
          _options.planets = planets.map(planet => ({ value: planet.id, label: planet.name }))
        })
      ]).then(() => {
        commit('options', _options)
      })
      if (!id) {
        return promise
      }
      return promise.then(() => {
        return rootGetters.db.rel.find('species', [ id ])
      }).then(({ species }) => {
        if (species[0]) {
          commit('data', species[0])
        } else if (process.env.MODE !== 'ssr') {
          this.$router.replace({ name: 'not_found' })
        }
      })
    },
    saveSpecies ({ state, commit, getters, rootGetters }) {
      if (!getters.created) {
        commit('created', new Date())
      }
      commit('edited', new Date())
      rootGetters.db.rel.save('species', state.data).then(() => {
        Notify.create({ message: `Species ${state.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  },
  getters: {
    created (state) { return state.data.created ? new Date(state.data.created) : null },
    edited (state) { return state.data.edited ? new Date(state.data.edited) : null }
  }
}
