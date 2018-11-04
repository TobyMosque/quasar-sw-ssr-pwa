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
        <q-btn :to="{ name: 'films-create' }" icon="create" color="primary">New Film</q-btn>
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
            <q-btn flat color="primary" label="Edit" icon="edit" :to="{ name: 'films-edit', params: { id: props.row.id } }" />
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
    visibleColumns: {
      get () { return this.$store.state.columns.films },
      set (value) { this.$store.commit('columns/films', value) }
    }
  },
  methods: {
    init () {
      this.$db.rel.find('films').then(({ films }) => {
        this.data = films
      })
    },
    deleteFilm (film) {
      this.$q.dialog({
        title: 'Delete Film',
        message: `Are you sure to delete the film ${film.title}?`,
        ok: true,
        cancel: true
      }).then(() => {
        return this.$db.rel.del('film', film)
      }).then(() => {
        let index = this.data.findIndex(item => item.id === film.id)
        this.data.splice(index, 1)
        this.$q.notify({ message: `Film ${film.title} deleted!`, color: 'primary' })
      })
    }
  }
}
</script>
