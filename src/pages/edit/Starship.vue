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
import starshipEdit from '../../store/pages/edit/starship'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, currentRoute, ssrContext }) {
    if (!starshipEdit.registered) {
      starshipEdit.registered = true
      store.registerModule('starshipEdit', starshipEdit)
    }
    return store.dispatch('starshipEdit/init', currentRoute.params.id)
  },
  computed: {
    data: {
      get () { return this.$store.state.starshipEdit.data },
      set (value) { this.$store.commit('starshipEdit/data', value) }
    },
    options: {
      get () { return this.$store.state.starshipEdit.options },
      set (value) { this.$store.commit('starshipEdit/options', value) }
    },
    selected: {
      get () { return this.$store.state.starshipEdit.selected },
      set (value) { this.$store.commit('starshipEdit/selected', value) }
    },
    created: {
      get () { return this.$store.getters['starshipEdit/created'] },
      set (value) { this.$store.commit('starshipEdit/created', value ? value.toISOString() : null) }
    },
    edited: {
      get () { return this.$store.getters['starshipEdit/edited'] },
      set (value) { this.$store.commit('starshipEdit/edited', value ? value.toISOString() : null) }
    }
  },
  methods: {
    ...mapActions('starshipEdit', {
      init: 'init',
      saveStarship: 'saveStarship'
    })
  }
}
</script>
