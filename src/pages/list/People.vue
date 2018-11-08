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
        <q-btn to="people/create" icon="create" color="primary">New Person</q-btn>
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="'people/' + props.row.id" />
            <q-btn flat color="negative" label="Delete" icon="delete" @click="deletePerson(props.row)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import peopleList from '../../store/pages/list/people'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, ssrContext }) {
    if (!store.state.peopleList) {
      store.registerModule('peopleList', peopleList)
    }
    return store.dispatch('peopleList/init')
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
          name: 'birth_year',
          label: 'Birth Year',
          field: row => row.birth_year
        },
        {
          name: 'gender',
          label: 'Gender',
          field: row => row.gender
        },
        {
          name: 'height',
          label: 'Height',
          field: row => row.height
        },
        {
          name: 'mass',
          label: 'Mass',
          field: row => row.mass
        },
        {
          name: 'eye_color',
          label: 'Eye Color',
          field: row => row.eye_color
        },
        {
          name: 'hair_color',
          label: 'Hair Color',
          field: row => row.hair_color
        },
        {
          name: 'skin_color',
          label: 'Skin Color',
          field: row => row.skin_color
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
      get () { return this.$store.state.peopleList.filter },
      set (value) { this.$store.commit('peopleList/filter', value) }
    },
    data: {
      get () { return this.$store.state.peopleList.data },
      set (value) { this.$store.commit('peopleList/data', value) }
    },
    planets: {
      get () { return this.$store.state.peopleList.planets },
      set (value) { this.$store.commit('peopleList/planets', value) }
    },
    rowsPerPage: {
      get () { return this.$store.state.peopleList.rowsPerPage },
      set (value) { this.$store.commit('peopleList/rowsPerPage', value) }
    },
    pagination: {
      get () { return this.$store.state.peopleList.pagination },
      set (value) { this.$store.commit('peopleList/pagination', value) }
    },
    visibleColumns: {
      get () { return this.$store.state.peopleList.visibleColumns },
      set (value) { this.$store.commit('peopleList/visibleColumns', value) }
    }
  },
  methods: {
    ...mapActions('peopleList', {
      init: 'init',
      deletePerson: 'deletePerson'
    })
  }
}
</script>
