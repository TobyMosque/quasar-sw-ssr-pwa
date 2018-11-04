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
        <q-btn :to="{ name: 'planets-create' }" icon="create" color="primary">New Planet</q-btn>
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="{ name: 'planets-edit', params: { id: props.row.id } }" />
            <q-btn flat color="negative" label="Delete" icon="delete" @click="deletePlanet(props.row)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      filter: '',
      data: [],
      rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
      pagination: { rowsPerPage: 12 },
      columns: [
        {
          name: 'name',
          required: true,
          field: row => row.name
        },
        {
          name: 'diameter',
          label: 'Diameter',
          field: row => row.diameter
        },
        {
          name: 'gravity',
          label: 'Gravity',
          field: row => row.gravity
        },
        {
          name: 'population',
          label: 'Population',
          field: row => row.population
        },
        {
          name: 'surface_water',
          label: 'Surface Water',
          field: row => row.surface_water
        },
        {
          name: 'rotation_period',
          label: 'Rotation Period',
          field: row => row.rotation_period
        },
        {
          name: 'orbital_period',
          label: 'Orbital Period',
          field: row => row.orbital_period
        },
        {
          name: 'climate',
          label: 'Climate',
          field: row => row.climate.split(',')[0]
        },
        {
          name: 'terrain',
          label: 'Terrain',
          field: row => row.terrain.split(',')[0]
        }
      ]
    }
  },
  computed: {
    visibleColumns: {
      get () { return this.$store.state.columns.planets },
      set (value) { this.$store.commit('columns/planets', value) }
    }
  },
  methods: {
    init () {
      this.$db.rel.find('planets').then(({ planets }) => {
        this.data = planets
      })
    },
    deletePlanets (planet) {
      this.$q.dialog({
        title: 'Delete Planet',
        message: `Are you sure to delete the planet ${planet.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return this.$db.rel.del('planet', planet)
      }).then(() => {
        let index = this.data.findIndex(item => item.id === planet.id)
        this.data.splice(index, 1)
        this.$q.notify({ message: `Planet ${planet.name} deleted!`, color: 'primary' })
      })
    }
  }
}
</script>
