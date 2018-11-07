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
import planetEdit from '../../store/pages/edit/planet'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, currentRoute, ssrContext }) {
    if (!planetEdit.registered) {
      planetEdit.registered = true
      store.registerModule('planetEdit', planetEdit)
    }
    return store.dispatch('planetEdit/init', currentRoute.params.id)
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
      get () { return this.$store.state.planetEdit.data },
      set (value) { this.$store.commit('planetEdit/data', value) }
    },
    options: {
      get () { return this.$store.state.planetEdit.options },
      set (value) { this.$store.commit('planetEdit/options', value) }
    },
    selected: {
      get () { return this.$store.state.planetEdit.selected },
      set (value) { this.$store.commit('planetEdit/selected', value) }
    },
    created: {
      get () { return this.$store.getters['planetEdit/created'] },
      set (value) { this.$store.commit('planetEdit/created', value ? value.toISOString() : null) }
    },
    edited: {
      get () { return this.$store.getters['planetEdit/edited'] },
      set (value) { this.$store.commit('planetEdit/edited', value ? value.toISOString() : null) }
    }
  },
  methods: {
    ...mapActions('planetEdit', {
      init: 'init',
      savePlanet: 'savePlanet'
    })
  }
}
</script>
