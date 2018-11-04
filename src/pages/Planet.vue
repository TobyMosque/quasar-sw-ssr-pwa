<template>
  <q-page class="q-ma-sm">
    <q-card class="transition-generic">
      <q-card-title class="relative-position">
        {{$route.name.indexOf('edit') !== -1 ? 'Edit' : 'New'}} Planet
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-collapsible label="Data" :opened="true">
          <div class="row">
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.name" float-label="Name" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.diameter" float-label="Diameter" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.rotation_period" float-label="Rotation Period" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.orbital_period" float-label="Orbital Period" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.gravity" float-label="Gravity" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.population" float-label="Population" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.climate" float-label="Climate" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.terrain" float-label="Terrain" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.surface_water" float-label="Surface Water" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="created">
              <q-datetime v-model="created" float-label="Created At" type="datetime" readonly modal />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="edited">
              <q-datetime v-model="edited" float-label="Edited At" type="datetime" readonly modal />
            </q-field>
          </div>
        </q-collapsible>
        <edit-collapsible name="Residents" edit="people-edit" :options="options.residents" v-model="data.residents"></edit-collapsible>
        <edit-collapsible name="Films" edit="films-edit" :options="options.films" v-model="data.films"></edit-collapsible>
      </q-list>
      <q-card-actions>
        <q-btn style="width: calc(50% - 4px)" label="Cancel" icon="cancel" @click="$router.go(-1)" />
        <q-btn style="width: calc(50% - 4px)" color="primary" label="Save" icon="save" @click="savePlanet" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { uid } from 'quasar'
export default {
  name: 'PageIndex',
  data () {
    var that = this
    return {
      data: {
        id: uid(),
        rev: '',
        name: '',
        diameter: '',
        rotation_period: '',
        orbital_period: '',
        gravity: '',
        population: '',
        climate: '',
        terrain: '',
        surface_water: '',
        residents: [],
        films: [],
        created: null,
        edited: null
      },
      options: {
        residents: [],
        films: []
      },
      selected: {
        residents: [],
        films: []
      },
      after: {
        homeworld: [{
          icon: 'edit',
          content: true,
          handler () {
            that.$router.push({ name: 'planets-edit', params: { id: that.data.homeworld } })
          }
        }, {
          icon: 'close',
          content: true,
          handler () {
            that.data.homeworld = ''
          }
        }]
      }
    }
  },
  computed: {
    created: {
      get () { return this.data.created ? new Date(this.data.created) : null },
      set (value) { this.data.created = value ? value.toISOString() : null }
    },
    edited: {
      get () { return this.data.edited ? new Date(this.data.edited) : null },
      set (value) { this.data.edited = value ? value.toISOString() : null }
    }
  },
  methods: {
    init () {
      this.$db.rel.find('person').then(({ people }) => {
        this.options.residents = people.map(person => ({ value: person.id, label: person.name }))
      })
      this.$db.rel.find('film').then(({ films }) => {
        this.options.films = films.map(film => ({ value: film.id, label: film.title }))
      })
      if (this.$route.params.id) {
        this.$db.rel.find('planet', [ this.$route.params.id ]).then(({ planets }) => {
          if (planets[0]) {
            this.$set(this, 'data', planets[0])
          } else {
            this.$router.replace({ name: 'not_found' })
          }
        })
      }
    },
    savePlanet () {
      if (!this.created) {
        this.created = new Date()
      }
      this.edited = new Date()
      this.$db.rel.save('planet', this.data).then(() => {
        this.$q.notify({ message: `Planet ${this.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  }
}
</script>
