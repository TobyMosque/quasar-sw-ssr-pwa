// import something here
import axios from 'axios'
import { Loading } from 'quasar'
import uid from 'uuid/v4'
import db from '../../common/db'
export default ({ Vue }) => {
  var promise = null
  if (process.env.SERVER) {
    promise = db.instance.rel.find('planet').then(function (response) {
      if (response.planets && response.planets.length) {
        return null
      }
      var indice = {
        films: {},
        people: {},
        planets: {},
        species: {},
        starships: {},
        vehicles: {}
      }
      var getEntities = function (type, url) {
        return axios.get(url).then(function (response) {
          response.data.results.forEach(function (data) {
            indice[type][data.url] = {
              uid: uid(),
              url: data.url,
              value: data
            }
          })
          if (response.data.next) {
            return getEntities(type, response.data.next)
          }
        })
      }
      return Promise.all([
        getEntities('films', 'https://swapi.co/api/films/'),
        getEntities('people', 'https://swapi.co/api/people/'),
        getEntities('planets', 'https://swapi.co/api/planets/'),
        getEntities('species', 'https://swapi.co/api/species/'),
        getEntities('starships', 'https://swapi.co/api/starships/'),
        getEntities('vehicles', 'https://swapi.co/api/vehicles/')
      ]).then(function () {
        return indice
      })
    }).then(function (indice) {
      if (!indice) {
        return
      }
      var entities = {}
      entities.people = Object.keys(indice.people).map(function (key) {
        return indice.people[key]
      }).map(function (item) {
        var person = Object.assign({}, item.value)
        delete person.url
        delete person.homeworld
        delete person.films
        delete person.species
        delete person.starships
        delete person.vehicles
        person.id = item.uid
        person.homeworld = item.value.homeworld ? indice.planets[item.value.homeworld].uid : null
        person.films = item.value.films.map(function (url) {
          return indice.films[url].uid
        })
        person.species = item.value.species.map(function (url) {
          return indice.species[url].uid
        })
        person.starships = item.value.starships.map(function (url) {
          return indice.starships[url].uid
        })
        person.vehicles = item.value.vehicles.map(function (url) {
          return indice.vehicles[url].uid
        })
        return person
      })
      entities.films = Object.keys(indice.films).map(function (key) {
        return indice.films[key]
      }).map(function (item) {
        var film = Object.assign({}, item.value)
        delete film.url
        delete film.species
        delete film.starships
        delete film.vehicles
        delete film.characters
        delete film.planets
        film.id = item.uid
        film.species = item.value.species.map(function (url) {
          return indice.species[url].uid
        })
        film.starships = item.value.starships.map(function (url) {
          return indice.starships[url].uid
        })
        film.vehicles = item.value.vehicles.map(function (url) {
          return indice.vehicles[url].uid
        })
        film.characters = item.value.characters.map(function (url) {
          return indice.people[url].uid
        })
        film.planets = item.value.planets.map(function (url) {
          return indice.planets[url].uid
        })
        return film
      })
      entities.starships = Object.keys(indice.starships).map(function (key) {
        return indice.starships[key]
      }).map(function (item) {
        var starship = Object.assign({}, item.value)
        delete starship.url
        delete starship.films
        delete starship.pilots
        starship.id = item.uid
        starship.films = item.value.films.map(function (url) {
          return indice.films[url].uid
        })
        starship.pilots = item.value.pilots.map(function (url) {
          return indice.people[url].uid
        })
        return starship
      })
      entities.vehicles = Object.keys(indice.vehicles).map(function (key) {
        return indice.vehicles[key]
      }).map(function (item) {
        var vehicle = Object.assign({}, item.value)
        delete vehicle.url
        delete vehicle.films
        delete vehicle.pilots
        vehicle.id = item.uid
        vehicle.films = item.value.films.map(function (url) {
          return indice.films[url].uid
        })
        vehicle.pilots = item.value.pilots.map(function (url) {
          return indice.people[url].uid
        })
        return vehicle
      })
      entities.species = Object.keys(indice.species).map(function (key) {
        return indice.species[key]
      }).map(function (item) {
        var species = Object.assign({}, item.value)
        delete species.url
        delete species.films
        delete species.people
        species.id = item.uid
        species.homeworld = item.value.homeworld ? indice.planets[item.value.homeworld].uid : null
        species.films = item.value.films.map(function (url) {
          return indice.films[url].uid
        })
        species.people = item.value.people.map(function (url) {
          return indice.people[url].uid
        })
        return species
      })
      entities.planets = Object.keys(indice.planets).map(function (key) {
        return indice.planets[key]
      }).map(function (item) {
        var planet = Object.assign({}, item.value)
        delete planet.url
        delete planet.films
        delete planet.residents
        planet.id = item.uid
        planet.films = item.value.films.map(function (url) {
          return indice.films[url].uid
        })
        planet.residents = item.value.residents.map(function (url) {
          return indice.people[url].uid
        })
        return planet
      })
      var persist = function (singular, plural) {
        Promise.all(entities[plural].map(function (item) {
          return db.instance.rel.save(singular, item)
        }))
      }
      return Promise.resolve(0).then(function () {
        return persist('person', 'people')
      }).then(function () {
        return persist('film', 'films')
      }).then(function () {
        return persist('starship', 'starships')
      }).then(function () {
        return persist('vehicle', 'vehicles')
      }).then(function () {
        return persist('species', 'species')
      }).then(function () {
        return persist('planet', 'planets')
      })
    })
  } else {
    var loc = window.location
    var url = loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '') + '/db/sw'
    var local = db.instance
    var remote = new db.PouchDB(url)

    Loading.show({ message: 'Syncing databases' })
    promise = Promise.resolve(0).then(function () {
      return navigator.onLine ? local.replicate.from(remote) : Promise.resolve(0)
    }).then(function () {
      return navigator.onLine ? local.replicate.to(remote) : Promise.resolve(0)
    }).then(function () {
      Loading.hide()
      local.sync(remote, { live: true, retry: true })
    })
  }
  Vue.mixin({
    mounted: function () {
      if (this.init) {
        var that = this
        promise.then(function () {
          that.init()
        })
      }
    },
    created: function () {
      this.$db = db.instance
    }
  })
  return promise
}
