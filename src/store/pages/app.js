import axios from 'axios'
import { uid, Loading } from 'quasar'

export default {
  registered: false,
  namespaced: true,
  state: {
    isSyncing: false,
    loaded: {
      local: false,
      server: false
    }
  },
  mutations: {
    loadedLocal (state, value) { state.loaded.local = value },
    loadedServer (state, value) { state.loaded.server = value }
  },
  actions: {
    init ({ state, rootGetters, dispatch, commit }) {
      if (process.env.SERVER) {
        if (!state.loaded.server) {
          commit('loadedServer', true)
          return rootGetters.db.rel.find('planet', { limit: 1 }).then(query => {
            if (!query.planets || !query.planets.length) {
              return dispatch('initServer')
            }
          })
        }
      } else {
        if (!state.loaded.local) {
          commit('loadedLocal', true)
          return dispatch('initLocal')
        }
      }
    },
    initLocal ({ rootGetters, dispatch }) {
      var loc = window.location
      var url = loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '') + '/db/sw'
      return dispatch('newDb', url, { root: true }).then(remote => {
        Loading.show({ message: 'Syncing databases' })
        return Promise.resolve().then(() => {
          return navigator.onLine ? rootGetters.db.replicate.from(remote) : Promise.resolve()
        }).then(() => {
          return navigator.onLine ? rootGetters.db.replicate.to(remote) : Promise.resolve()
        }).then(() => {
          Loading.hide()
          rootGetters.db.sync(remote, { live: true, retry: true })

          return dispatch('isSyncing', null, { root: true })
        })
      })
    },
    initServer ({ dispatch }) {
      var index = {
        films: {},
        people: {},
        planets: {},
        species: {},
        starships: {},
        vehicles: {}
      }
      return Promise.all([
        dispatch('getEntities', { index: index.films, url: 'https://swapi.co/api/films/' }),
        dispatch('getEntities', { index: index.people, url: 'https://swapi.co/api/people/' }),
        dispatch('getEntities', { index: index.planets, url: 'https://swapi.co/api/planets/' }),
        dispatch('getEntities', { index: index.species, url: 'https://swapi.co/api/species/' }),
        dispatch('getEntities', { index: index.starships, url: 'https://swapi.co/api/starships/' }),
        dispatch('getEntities', { index: index.vehicles, url: 'https://swapi.co/api/vehicles/' })
      ]).then(() => {
        var entities = {}
        entities.people = Object.keys(index.people).map((key) => {
          return index.people[key]
        }).map((item) => {
          var person = Object.assign({}, item.value)
          delete person.url
          delete person.homeworld
          delete person.films
          delete person.species
          delete person.starships
          delete person.vehicles
          person.id = item.uid
          person.homeworld = item.value.homeworld ? index.planets[item.value.homeworld].uid : null
          person.films = item.value.films.map((url) => {
            return index.films[url].uid
          })
          person.species = item.value.species.map((url) => {
            return index.species[url].uid
          })
          person.starships = item.value.starships.map((url) => {
            return index.starships[url].uid
          })
          person.vehicles = item.value.vehicles.map((url) => {
            return index.vehicles[url].uid
          })
          return person
        })
        entities.films = Object.keys(index.films).map((key) => {
          return index.films[key]
        }).map((item) => {
          var film = Object.assign({}, item.value)
          delete film.url
          delete film.species
          delete film.starships
          delete film.vehicles
          delete film.characters
          delete film.planets
          film.id = item.uid
          film.species = item.value.species.map((url) => {
            return index.species[url].uid
          })
          film.starships = item.value.starships.map((url) => {
            return index.starships[url].uid
          })
          film.vehicles = item.value.vehicles.map((url) => {
            return index.vehicles[url].uid
          })
          film.characters = item.value.characters.map((url) => {
            return index.people[url].uid
          })
          film.planets = item.value.planets.map((url) => {
            return index.planets[url].uid
          })
          return film
        })
        entities.starships = Object.keys(index.starships).map((key) => {
          return index.starships[key]
        }).map((item) => {
          var starship = Object.assign({}, item.value)
          delete starship.url
          delete starship.films
          delete starship.pilots
          starship.id = item.uid
          starship.films = item.value.films.map((url) => {
            return index.films[url].uid
          })
          starship.pilots = item.value.pilots.map((url) => {
            return index.people[url].uid
          })
          return starship
        })
        entities.vehicles = Object.keys(index.vehicles).map((key) => {
          return index.vehicles[key]
        }).map((item) => {
          var vehicle = Object.assign({}, item.value)
          delete vehicle.url
          delete vehicle.films
          delete vehicle.pilots
          vehicle.id = item.uid
          vehicle.films = item.value.films.map((url) => {
            return index.films[url].uid
          })
          vehicle.pilots = item.value.pilots.map((url) => {
            return index.people[url].uid
          })
          return vehicle
        })
        entities.species = Object.keys(index.species).map((key) => {
          return index.species[key]
        }).map((item) => {
          var species = Object.assign({}, item.value)
          delete species.url
          delete species.films
          delete species.people
          species.id = item.uid
          species.homeworld = item.value.homeworld ? index.planets[item.value.homeworld].uid : null
          species.films = item.value.films.map((url) => {
            return index.films[url].uid
          })
          species.people = item.value.people.map((url) => {
            return index.people[url].uid
          })
          return species
        })
        entities.planets = Object.keys(index.planets).map((key) => {
          return index.planets[key]
        }).map((item) => {
          var planet = Object.assign({}, item.value)
          delete planet.url
          delete planet.films
          delete planet.residents
          planet.id = item.uid
          planet.films = item.value.films.map((url) => {
            return index.films[url].uid
          })
          planet.residents = item.value.residents.map((url) => {
            return index.people[url].uid
          })
          return planet
        })
        return Promise.all([
          dispatch('persistEntities', { type: 'person', entities: entities.people }),
          dispatch('persistEntities', { type: 'film', entities: entities.films }),
          dispatch('persistEntities', { type: 'starship', entities: entities.starships }),
          dispatch('persistEntities', { type: 'vehicle', entities: entities.vehicles }),
          dispatch('persistEntities', { type: 'species', entities: entities.species }),
          dispatch('persistEntities', { type: 'planet', entities: entities.planets })
        ])
      })
    },
    getEntities ({ dispatch }, obj) {
      return axios.get(obj.url).then(response => {
        response.data.results.forEach((data) => {
          obj.index[data.url] = {
            uid: uid(),
            url: data.url,
            value: data
          }
        })
        if (response.data.next) {
          obj.url = response.data.next
          return dispatch('getEntities', obj)
        }
      })
    },
    persistEntities ({ rootGetters }, obj) {
      let promises = obj.entities.map(item => rootGetters.db.rel.save(obj.type, item))
      return Promise.all(promises)
    }
  }
}
