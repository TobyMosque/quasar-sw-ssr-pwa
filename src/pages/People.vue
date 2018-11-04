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
        <q-btn :to="{ name: 'people-create' }" icon="create" color="primary">New Person</q-btn>
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="{ name: 'people-edit', params: { id: props.row.id } }" />
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
export default {
  name: 'PageIndex',
  data () {
    var that = this
    return {
      filter: '',
      data: [],
      planets: [],
      rowsPerPage: [6, 12, 24, 36, 48, 72, 96],
      pagination: { rowsPerPage: 12 },
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
    visibleColumns: {
      get () { return this.$store.state.columns.people },
      set (value) { this.$store.commit('columns/people', value) }
    }
  },
  methods: {
    init () {
      this.$db.rel.find('person').then(({ people }) => {
        this.data = people
        return this.$db.rel.find('planet')
      }).then(({ planets }) => {
        this.planets = {}
        planets.forEach((planet) => {
          this.planets[planet.id] = planet.name
        })
      })
    },
    deletePerson (person) {
      this.$q.dialog({
        title: 'Delete Person',
        message: `Are you sure to delete the person ${person.name}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return this.$db.rel.del('person', person)
      }).then(() => {
        let index = this.data.findIndex(item => item.id === person.id)
        this.data.splice(index, 1)
        this.$q.notify({ message: `Person ${person.name} deleted!`, color: 'primary' })
      })
    }
  }
}
</script>
