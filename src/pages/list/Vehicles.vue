<template>
  <q-page class="q-ma-sm">
    <q-table
      grid
      hide-header
      :data="data"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      :rows-per-page-options="rowsPerPage"
      :pagination.sync="pagination"
      row-key="name"
    >
      <template slot="top-left" slot-scope="props">
        <q-btn to="vehicles/create" icon="create" color="primary">New Vehicle</q-btn>
        <q-search class="q-pl-sm" hide-underline v-model="filter" />
      </template>
      <template slot="top-right" slot-scope="props">
        <q-table-columns
          v-model="visibleColumns"
          :columns="columns"
        />
      </template>
      <div
        slot="item"
        slot-scope="props"
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 transition-generic"
      >
        <q-card class="transition-generic">
          <q-card-title class="relative-position">
            {{ props.row.name }}
          </q-card-title>
          <q-card-separator />
          <q-card-main class="q-pa-none">
            <q-list no-border>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'name')" :key="col.name">
                <q-item-main>
                  <q-item-tile label>{{ col.label }}</q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-item-tile>{{ col.value }}</q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
          </q-card-main>
          <q-card-actions>
            <q-btn flat color="primary" label="Edit" icon="edit" :to="'vehicles/' + props.row.id" />
            <q-btn flat color="negative" label="Delete" icon="delete" @click="deleteVehicle(props.row)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-table>
  </q-page>
</template>

<style>
.text-overflow {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

<script>
import vehiclesList from '../../store/pages/list/vehicles'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, ssrContext }) {
    if (!store.state.vehiclesList) {
      store.registerModule('vehiclesList', vehiclesList)
    }
    return store.dispatch('vehiclesList/init')
  },
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          field: row => row.name
        },
        {
          name: 'model',
          label: 'Model',
          field: row => row.model
        },
        {
          name: 'vehicle_class',
          label: 'Vehicle Class',
          field: row => row.vehicle_class
        },
        {
          name: 'manufacturer',
          label: 'Manufacturer',
          field: row => row.manufacturer.split(',')[0]
        },
        {
          name: 'crew',
          label: 'Crew',
          field: row => row.crew
        },
        {
          name: 'passengers',
          label: 'Passengers',
          field: row => row.passengers
        },
        {
          name: 'cost_in_credits',
          label: 'Cost in Credits',
          field: row => row.cost_in_credits
        },
        {
          name: 'length',
          label: 'Length',
          field: row => row.length
        },
        {
          name: 'max_atmosphering_speed',
          label: 'Max Atmosphering Speed',
          field: row => row.max_atmosphering_speed
        },
        {
          name: 'cargo_capacity',
          label: 'Cargo Capacity',
          field: row => row.cargo_capacity
        },
        {
          name: 'consumables',
          label: 'Consumables',
          field: row => row.consumables
        }
      ]
    }
  },
  computed: {
    filter: {
      get () { return this.$store.state.vehiclesList.filter },
      set (value) { this.$store.commit('vehiclesList/filter', value) }
    },
    data: {
      get () { return this.$store.state.vehiclesList.data },
      set (value) { this.$store.commit('vehiclesList/data', value) }
    },
    rowsPerPage: {
      get () { return this.$store.state.vehiclesList.rowsPerPage },
      set (value) { this.$store.commit('vehiclesList/rowsPerPage', value) }
    },
    pagination: {
      get () { return this.$store.state.vehiclesList.pagination },
      set (value) { this.$store.commit('vehiclesList/pagination', value) }
    },
    visibleColumns: {
      get () { return this.$store.state.vehiclesList.visibleColumns },
      set (value) { this.$store.commit('vehiclesList/visibleColumns', value) }
    }
  },
  methods: {
    ...mapActions('planetsList', {
      init: 'init',
      deleteVehicle: 'deleteVehicle'
    })
  }
}
</script>
