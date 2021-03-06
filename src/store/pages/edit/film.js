import { uid, Notify } from 'quasar'
import Vue from 'vue'
let data = {
  id: uid(),
  rev: '',
  title: '',
  episode_id: 0,
  opening_crawl: '',
  director: '',
  producer: '',
  release_date: new Date(),
  species: [],
  starships: [],
  vehicles: [],
  characters: [],
  planets: [],
  created: null,
  edited: null
}
let options = {
  species: [],
  starships: [],
  vehicles: [],
  characters: [],
  planets: []
}
let selected = {
  species: [],
  starships: [],
  vehicles: [],
  characters: [],
  planets: []
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
    release_date (state, value) { Vue.set(state.data, 'release_date', value ? value.toISOString() : null) },
    created (state, value) { Vue.set(state.data, 'created', value ? value.toISOString() : null) },
    edited (state, value) { Vue.set(state.data, 'edited', value ? value.toISOString() : null) }
  },
  actions: {
    init ({ commit, rootGetters }, id) {
      commit('data', { ...data })
      commit('selected', { ...selected })
      var _options = {}
      var promise = Promise.all([
        rootGetters.db.rel.find('species').then(({ species }) => {
          _options.species = species.map(species => ({ value: species.id, label: species.name }))
        }),
        rootGetters.db.rel.find('starship').then(({ starships }) => {
          _options.starships = starships.map(starship => ({ value: starship.id, label: starship.name }))
        }),
        rootGetters.db.rel.find('vehicle').then(({ vehicles }) => {
          _options.vehicles = vehicles.map(vehicle => ({ value: vehicle.id, label: vehicle.name }))
        }),
        rootGetters.db.rel.find('person').then(({ people }) => {
          _options.characters = people.map(person => ({ value: person.id, label: person.name }))
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
        return rootGetters.db.rel.find('film', [ id ])
      }).then(({ films }) => {
        if (films[0]) {
          commit('data', films[0])
        } else if (process.env.MODE !== 'ssr') {
          this.$router.replace({ name: 'not_found' })
        }
      })
    },
    saveFilm ({ state, commit, getters, rootGetters }) {
      if (!getters.created) {
        commit('created', new Date())
      }
      commit('edited', new Date())
      rootGetters.db.rel.save('film', state.data).then(() => {
        Notify.create({ message: `Film ${state.data.title} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  },
  getters: {
    release_date (state) { return state.data.release_date ? new Date(state.data.release_date) : null },
    created (state) { return state.data.created ? new Date(state.data.created) : null },
    edited (state) { return state.data.edited ? new Date(state.data.edited) : null }
  }
}
