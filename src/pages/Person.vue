<template>
  <q-page class="q-ma-sm">
    <q-card class="transition-generic">
      <q-card-title class="relative-position">
        {{$route.name.indexOf('edit') !== -1 ? 'Edit' : 'New'}} Person
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-collapsible label="Data" :opened="true">
          <div class="row">
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.name" float-label="Name" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.birth_year" float-label="Birth Year" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.eye_color" float-label="Eye Color" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.gender" float-label="Gender" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.hair_color" float-label="Hair Color" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.height" float-label="Height" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.mass" float-label="Mass" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.skin_color" float-label="Skin Color " />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-select filter v-model="data.homeworld" float-label="Homeworld" :options="options.planets" :after="after.homeworld" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="created">
              <q-datetime v-model="created" float-label="Created At" type="datetime" readonly modal />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="edited">
              <q-datetime v-model="edited" float-label="Edited At" type="datetime" readonly modal />
            </q-field>
          </div>
        </q-collapsible>
        <edit-collapsible name="Films" edit="films-edit" :options="options.films" v-model="data.films"></edit-collapsible>
        <edit-collapsible name="Species" edit="species-edit" :options="options.species" v-model="data.species"></edit-collapsible>
        <edit-collapsible name="Starships" edit="starships-edit" :options="options.starships" v-model="data.starships"></edit-collapsible>
        <edit-collapsible name="Vehicles" edit="vehicles-edit" :options="options.vehicles" v-model="data.vehicles"></edit-collapsible>
      </q-list>
      <q-card-actions>
        <q-btn style="width: calc(50% - 4px)" label="Cancel" icon="cancel" @click="$router.go(-1)" />
        <q-btn style="width: calc(50% - 4px)" color="primary" label="Save" icon="save" @click="savePerson" />
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
        birth_year: '',
        eye_color: '',
        gender: '',
        hair_color: '',
        height: '',
        mass: '',
        skin_color: '',
        homeworld: '',
        films: [],
        species: [],
        starships: [],
        vehicles: [],
        created: null,
        edited: null
      },
      options: {
        films: [],
        species: [],
        starships: [],
        vehicles: [],
        planets: []
      },
      selected: {
        films: [],
        species: [],
        starships: [],
        vehicles: []
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
      this.$db.rel.find('film').then(({ films }) => {
        this.options.films = films.map(film => ({ value: film.id, label: film.title }))
      })
      this.$db.rel.find('species').then(({ species }) => {
        this.options.species = species.map(species => ({ value: species.id, label: species.name }))
      })
      this.$db.rel.find('starship').then(({ starships }) => {
        this.options.starships = starships.map(starship => ({ value: starship.id, label: starship.name }))
      })
      this.$db.rel.find('vehicle').then(({ vehicles }) => {
        this.options.vehicles = vehicles.map(vehicle => ({ value: vehicle.id, label: vehicle.name }))
      })
      this.$db.rel.find('planet').then(({ planets }) => {
        this.options.planets = planets.map(planet => ({ value: planet.id, label: planet.name }))
      })
      if (this.$route.params.id) {
        this.$db.rel.find('person', [ this.$route.params.id ]).then(({ people }) => {
          if (people[0]) {
            this.$set(this, 'data', people[0])
          } else {
            this.$router.replace({ name: 'not_found' })
          }
        })
      }
    },
    savePerson () {
      if (!this.created) {
        this.created = new Date()
      }
      this.edited = new Date()
      this.$db.rel.save('person', this.data).then(() => {
        this.$q.notify({ message: `Person ${this.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  }
}
</script>
