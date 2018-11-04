export default {
  namespaced: true,
  state: {
    films: ['episode_id', 'director', 'producer_0', 'release_date'],
    people: ['birth_year', 'gender', 'height', 'mass'],
    planets: ['diameter', 'gravity', 'population', 'surface_water'],
    species: ['classification', 'designation', 'language', 'homeworld'],
    starships: ['model', 'starship_class', 'manufacturer', 'crew', 'passengers'],
    vehicles: ['model', 'vehicle_class', 'manufacturer', 'crew', 'passengers']
  },
  mutations: {
    films (state, value) { state.films = value },
    people (state, value) { state.people = value },
    planets (state, value) { state.planets = value },
    species (state, value) { state.species = value },
    starships (state, value) { state.starships = value },
    vehicles (state, value) { state.vehicles = value }
  }
}
