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
        <q-btn to="species/create" icon="create" color="primary">New Species</q-btn>
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="'species/' + props.row.id" />
            <q-btn flat color="negative" label="Delete" icon="delete" @click="deleteSpecies(props.row)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import speciesList from '../../store/pages/list/species'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, ssrContext }) {
    if (!store.state.speciesList) {
      store.registerModule('speciesList', speciesList)
    }
    return store.dispatch('speciesList/init')
  },
  data () {
    var that = this
    return {
      columns: [
        {
          name: 'name',
          required: true,
          field: row => row.name
        },
        {
          name: 'classification',
          label: 'Classification',
          field: row => row.classification
        },
        {
          name: 'designation',
          label: 'Designation',
          field: row => row.designation
        },
        {
          name: 'language',
          label: 'Language',
          field: row => row.language
        },
        {
          name: 'average_height',
          label: 'Average Height',
          field: row => row.average_height
        },
        {
          name: 'average_lifespan',
          label: 'Average Lifespan',
          field: row => row.average_lifespan
        },
        {
          name: 'eye_colors',
          label: 'Eye Colors',
          field: row => row.eye_colors.split(',')[0]
        },
        {
          name: 'hair_colors',
          label: 'Hair Colors',
          field: row => row.hair_colors.split(',')[0]
        },
        {
          name: 'skin_colors',
          label: 'Skin Colors',
          field: row => row.skin_colors.split(',')[0]
        },
        {
          name: 'homeworld',
          label: 'Homeworld',
          field: row => that.planets[row.homeworld]
        }
      ]
    }
  },
  computed: {
    filter: {
      get () { return this.$store.state.speciesList.filter },
      set (value) { this.$store.commit('speciesList/filter', value) }
    },
    data: {
      get () { return this.$store.state.speciesList.data },
      set (value) { this.$store.commit('speciesList/data', value) }
    },
    planets: {
      get () { return this.$store.state.speciesList.planets },
      set (value) { this.$store.commit('speciesList/planets', value) }
    },
    rowsPerPage: {
      get () { return this.$store.state.speciesList.rowsPerPage },
      set (value) { this.$store.commit('speciesList/rowsPerPage', value) }
    },
    pagination: {
      get () { return this.$store.state.speciesList.pagination },
      set (value) { this.$store.commit('speciesList/pagination', value) }
    },
    visibleColumns: {
      get () { return this.$store.state.speciesList.visibleColumns },
      set (value) { this.$store.commit('speciesList/visibleColumns', value) }
    }
  },
  methods: {
    ...mapActions('planetsList', {
      init: 'init',
      deleteSpecies: 'deleteSpecies'
    })
  }
}
</script>
