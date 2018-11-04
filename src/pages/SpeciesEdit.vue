<template>
  <q-page class="q-ma-sm">
    <q-card class="transition-generic">
      <q-card-title class="relative-position">
        {{$route.name.indexOf('edit') !== -1 ? 'Edit' : 'New'}} Species
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-collapsible label="Data" :opened="true">
          <div class="row">
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.name" float-label="Name" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.classification" float-label="Classification" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.designation" float-label="Designation" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.average_height" float-label="Average Height" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.average_lifespan" float-label="Average Lifespan" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.eye_colors" float-label="Eye Colors" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.hair_colors" float-label="Hair Colors" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.skin_color" float-label="Skin Color" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.language" float-label="Language" />
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
        <edit-collapsible name="People" edit="people-edit" :options="options.people" v-model="data.people"></edit-collapsible>
        <edit-collapsible name="Films" edit="films-edit" :options="options.films" v-model="data.films"></edit-collapsible>
      </q-list>
      <q-card-actions>
        <q-btn style="width: calc(50% - 4px)" label="Cancel" icon="cancel" @click="$router.go(-1)" />
        <q-btn style="width: calc(50% - 4px)" color="primary" label="Save" icon="save" @click="saveSpecies" />
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
        classification: '',
        designation: '',
        average_height: '',
        average_lifespan: '',
        eye_colors: '',
        hair_colors: '',
        skin_colors: '',
        language: '',
        homeworld: '',
        people: [],
        films: [],
        created: null,
        edited: null
      },
      options: {
        people: [],
        films: [],
        planets: []
      },
      selected: {
        people: [],
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
        this.options.people = people.map(person => ({ value: person.id, label: person.name }))
      })
      this.$db.rel.find('film').then(({ films }) => {
        this.options.films = films.map(film => ({ value: film.id, label: film.title }))
      })
      this.$db.rel.find('planet').then(({ planets }) => {
        this.options.planets = planets.map(planet => ({ value: planet.id, label: planet.name }))
      })
      if (this.$route.params.id) {
        this.$db.rel.find('species', [ this.$route.params.id ]).then(({ species }) => {
          if (species[0]) {
            this.$set(this, 'data', species[0])
          } else {
            this.$router.replace({ name: 'not_found' })
          }
        })
      }
    },
    saveSpecies () {
      if (!this.created) {
        this.created = new Date()
      }
      this.edited = new Date()
      this.$db.rel.save('species', this.data).then(() => {
        this.$q.notify({ message: `Species ${this.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  }
}
</script>
