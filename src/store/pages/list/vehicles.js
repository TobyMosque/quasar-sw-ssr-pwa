import Vue from 'vue'
import { Dialog, Notify } from 'quasar'
export default {
  namespaced: true,
  state: {
    filter: '',
    data: [],
    rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
    pagination: { rowsPerPage: 12 },
    visibleColumns: ['model', 'vehicle_class', 'manufacturer', 'crew', 'passengers']
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
      return rootGetters.db.rel.find('vehicle').then(({ vehicles }) => {
        commit('data', vehicles)
        return Promise.resolve()
      })
    },
    deleteVehicle ({ state, commit, rootGetters }, vehicle) {
      return Dialog.create({
        title: 'Delete Vehicle',
        message: `Are you sure to delete the vehicle ${vehicle.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return rootGetters.db.rel.del('vehicle', vehicle)
      }).then(() => {
        let index = state.data.findIndex(item => item.id === vehicle.id)
        commit('remoteItem', index)
        Notify.create({ message: `Vehicle ${vehicle.name} deleted!`, color: 'primary' })
      })
    }
  }
}
