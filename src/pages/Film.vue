<template>
  <q-page class="q-ma-sm">
    <q-card class="transition-generic">
      <q-card-title class="relative-position">
        {{$route.name.indexOf('edit') !== -1 ? 'Edit' : 'New'}} Film
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-collapsible label="Data" :opened="true">
          <div class="row">
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.title" float-label="Title" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input type="number" v-model="data.episode_id" float-label="Episode ID" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.director" float-label="Director" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.producer" float-label="Producer(s)" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-datetime v-model="release_date" float-label="Release Date" type="date" modal />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="created">
              <q-datetime v-model="created" float-label="Created At" type="datetime" readonly modal />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-if="edited">
              <q-datetime v-model="edited" float-label="Edited At" type="datetime" readonly modal />
            </q-field>
          </div>
          <div class="row">
            <q-field class="q-pa-xs col-lg-12">
              <label>
                <span class="q-if-label">Opening Crawl</span>
                <q-editor v-model="data.opening_crawl" />
              </label>
            </q-field>
          </div>
        </q-collapsible>
        <edit-collapsible name="Species" edit="species-edit" :options="options.species" v-model="data.species"></edit-collapsible>
        <edit-collapsible name="Starships" edit="starships-edit" :options="options.starships" v-model="data.starships"></edit-collapsible>
        <edit-collapsible name="Vehicles" edit="vehicles-edit" :options="options.vehicles" v-model="data.vehicles"></edit-collapsible>
        <edit-collapsible name="Characters" edit="people-edit" :options="options.characters" v-model="data.characters"></edit-collapsible>
        <edit-collapsible name="Planets" edit="planets-edit" :options="options.planets" v-model="data.planets"></edit-collapsible>
      </q-list>
      <q-card-actions>
        <q-btn style="width: calc(50% - 4px)" label="Cancel" icon="cancel" @click="$router.go(-1)" />
        <q-btn style="width: calc(50% - 4px)" color="primary" label="Save" icon="save" @click="saveFilm" />
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
    return {
      data: {
        id: uid(),
        rev: '',
        title: '',
        episode_id: 0,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: new Date(),
        species: [],
        starships: [],
        vehicles: [],
        characters: [],
        planets: [],
        created: null,
        edited: null
      },
      options: {
        species: [],
        starships: [],
        vehicles: [],
        characters: [],
        planets: []
      },
      selected: {
        species: [],
        starships: [],
        vehicles: [],
        characters: [],
        planets: []
      }
    }
  },
  computed: {
    release_date: {
      get () { return this.data.release_date ? new Date(this.data.release_date) : null },
      set (value) { this.data.release_date = value ? value.toISOString() : null }
    },
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
      this.$db.rel.find('species').then(({ species }) => {
        this.options.species = species.map(species => ({ value: species.id, label: species.name }))
      })
      this.$db.rel.find('starship').then(({ starships }) => {
        this.options.starships = starships.map(starship => ({ value: starship.id, label: starship.name }))
      })
      this.$db.rel.find('vehicle').then(({ vehicles }) => {
        this.options.vehicles = vehicles.map(vehicle => ({ value: vehicle.id, label: vehicle.name }))
      })
      this.$db.rel.find('person').then(({ people }) => {
        this.options.characters = people.map(person => ({ value: person.id, label: person.name }))
      })
      this.$db.rel.find('planet').then(({ planets }) => {
        this.options.planets = planets.map(planet => ({ value: planet.id, label: planet.name }))
      })
      if (this.$route.params.id) {
        this.$db.rel.find('films', [ this.$route.params.id ]).then(({ films }) => {
          if (films[0]) {
            this.$set(this, 'data', films[0])
          } else {
            this.$router.replace({ name: 'not_found' })
          }
        })
      }
    },
    saveFilm () {
      if (!this.created) {
        this.created = new Date()
      }
      this.edited = new Date()
      this.$db.rel.save('film', this.data).then(() => {
        this.$q.notify({ message: `Film ${this.data.film} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  }
}
</script>
