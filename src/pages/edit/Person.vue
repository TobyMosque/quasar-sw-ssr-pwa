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
import personEdit from '../../store/pages/edit/person'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, currentRoute, ssrContext }) {
    if (!store.state.personEdit) {
      store.registerModule('personEdit', personEdit)
    }
    return store.dispatch('personEdit/init', currentRoute.params.id)
  },
  data () {
    var that = this
    return {
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
    data: {
      get () { return this.$store.state.personEdit.data },
      set (value) { this.$store.commit('personEdit/data', value) }
    },
    options: {
      get () { return this.$store.state.personEdit.options },
      set (value) { this.$store.commit('personEdit/options', value) }
    },
    selected: {
      get () { return this.$store.state.personEdit.selected },
      set (value) { this.$store.commit('personEdit/selected', value) }
    },
    created: {
      get () { return this.$store.getters['personEdit/created'] },
      set (value) { this.$store.commit('personEdit/created', value ? value.toISOString() : null) }
    },
    edited: {
      get () { return this.$store.getters['personEdit/edited'] },
      set (value) { this.$store.commit('personEdit/edited', value ? value.toISOString() : null) }
    }
  },
  methods: {
    ...mapActions('personEdit', {
      init: 'init',
      savePerson: 'savePerson'
    })
  }
}
</script>
