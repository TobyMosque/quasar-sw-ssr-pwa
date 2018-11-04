<template>
  <q-page class="q-ma-sm">
    <q-card class="transition-generic">
      <q-card-title class="relative-position">
        {{$route.name.indexOf('edit') !== -1 ? 'Edit' : 'New'}} Starship
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-collapsible label="Data" :opened="true">
          <div class="row">
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.name" float-label="Name" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.model" float-label="Model" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.starship_class" float-label="Starship Class" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.manufacturer" float-label="Manufacturer(s)" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.cost_in_credits" float-label="Cost In Credits" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.length" float-label="Length" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.crew" float-label="Crew" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.passengers" float-label="Passengers" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.max_atmosphering_speed" float-label="Max Atmosphering Speed" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.hyperdrive_rating" float-label="Hyperdrive Rating" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.MGLT" float-label="MGLT" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.cargo_capacity" float-label="Cargo Capacity" />
            </q-field>
            <q-field class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input v-model="data.consumables" float-label="Consumables" />
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
        <edit-collapsible name="Pilots" edit="people-edit" :options="options.pilots" v-model="data.pilots"></edit-collapsible>
      </q-list>
      <q-card-actions>
        <q-btn style="width: calc(50% - 4px)" label="Cancel" icon="cancel" @click="$router.go(-1)" />
        <q-btn style="width: calc(50% - 4px)" color="primary" label="Save" icon="save" @click="saveStarship" />
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
        name: '',
        model: '',
        starship_class: '',
        manufacturer: '',
        cost_in_credits: '',
        length: '',
        crew: '',
        passengers: '',
        max_atmosphering_speed: '',
        hyperdrive_rating: '',
        MGLT: '',
        cargo_capacity: '',
        consumables: '',
        pilots: [],
        films: [],
        created: null,
        edited: null
      },
      options: {
        pilots: [],
        films: []
      },
      selected: {
        pilots: [],
        films: []
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
        this.options.pilots = people.map(person => ({ value: person.id, label: person.name }))
      })
      this.$db.rel.find('film').then(({ films }) => {
        this.options.films = films.map(film => ({ value: film.id, label: film.title }))
      })
      if (this.$route.params.id) {
        this.$db.rel.find('starship', [ this.$route.params.id ]).then(({ starships }) => {
          if (starships[0]) {
            this.$set(this, 'data', starships[0])
          } else {
            this.$router.replace({ name: 'not_found' })
          }
        })
      }
    },
    saveStarship () {
      if (!this.created) {
        this.created = new Date()
      }
      this.edited = new Date()
      this.$db.rel.save('starship', this.data).then(() => {
        this.$q.notify({ message: `Starship ${this.data.name} updated!`, color: 'primary' })
        this.$router.go(-1)
      })
    }
  }
}
</script>
