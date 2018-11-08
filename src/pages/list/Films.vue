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
        <q-btn to="films/create" icon="create" color="primary">New Film</q-btn>
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
            {{ props.row.title }}
          </q-card-title>
          <q-card-separator />
          <q-card-main class="q-pa-none">
            <q-list no-border>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'title')" :key="col.title">
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="'films/' + props.row.id" />
            <q-btn flat color="negative" label="Delete" icon="delete" @click="deleteFilm(props.row)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import filmsList from '../../store/pages/list/films'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, ssrContext }) {
    if (!store.state.filmsList) {
      store.registerModule('filmsList', filmsList)
    }
    return store.dispatch('filmsList/init')
  },
  data () {
    return {
      columns: [
        {
          name: 'title',
          required: true,
          field: row => row.title
        },
        {
          name: 'episode_id',
          label: 'Episode ID',
          field: row => row.episode_id
        },
        {
          name: 'director',
          label: 'Director',
          field: row => row.director
        },
        {
          name: 'producer',
          label: 'Producer',
          field: row => row.producer.split(',')[0]
        },
        {
          name: 'release_date',
          label: 'Release Date',
          field: row => row.release_date ? new Date(row.release_date).toLocaleDateString() : 'N/A'
        }
      ]
    }
  },
  computed: {
    filter: {
      get () { return this.$store.state.filmsList.filter },
      set (value) { this.$store.commit('filmsList/filter', value) }
    },
    data: {
      get () { return this.$store.state.filmsList.data },
      set (value) { this.$store.commit('filmsList/data', value) }
    },
    rowsPerPage: {
      get () { return this.$store.state.filmsList.rowsPerPage },
      set (value) { this.$store.commit('filmsList/rowsPerPage', value) }
    },
    pagination: {
      get () { return this.$store.state.filmsList.pagination },
      set (value) { this.$store.commit('filmsList/pagination', value) }
    },
    visibleColumns: {
      get () { return this.$store.state.filmsList.visibleColumns },
      set (value) { this.$store.commit('filmsList/visibleColumns', value) }
    }
  },
  methods: {
    ...mapActions('filmsList', {
      init: 'init',
      deleteFilm: 'deleteFilm'
    })
  }
}
</script>
