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
import speciesEdit from '../../store/pages/edit/species'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, currentRoute, ssrContext }) {
    if (!store.state.speciesEdit) {
      store.registerModule('speciesEdit', speciesEdit)
    }
    return store.dispatch('speciesEdit/init', currentRoute.params.id)
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
      get () { return this.$store.state.speciesEdit.data },
      set (value) { this.$store.commit('speciesEdit/data', value) }
    },
    options: {
      get () { return this.$store.state.speciesEdit.options },
      set (value) { this.$store.commit('speciesEdit/options', value) }
    },
    selected: {
      get () { return this.$store.state.speciesEdit.selected },
      set (value) { this.$store.commit('speciesEdit/selected', value) }
    },
    created: {
      get () { return this.$store.getters['speciesEdit/created'] },
      set (value) { this.$store.commit('speciesEdit/created', value ? value.toISOString() : null) }
    },
    edited: {
      get () { return this.$store.getters['speciesEdit/edited'] },
      set (value) { this.$store.commit('speciesEdit/edited', value ? value.toISOString() : null) }
    }
  },
  methods: {
    ...mapActions('speciesEdit', {
      init: 'init',
      saveSpecies: 'saveSpecies'
    })
  }
}
</script>
