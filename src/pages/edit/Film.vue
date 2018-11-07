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

<style></style>

<script>
import filmEdit from '../../store/pages/edit/film'
import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  preFetch ({ store, currentRoute, ssrContext }) {
    if (!filmEdit.registered) {
      filmEdit.registered = true
      store.registerModule('filmEdit', filmEdit)
    }
    return store.dispatch('filmEdit/init', currentRoute.params.id)
  },
  computed: {
    data: {
      get () { return this.$store.state.filmEdit.data },
      set (value) { this.$store.commit('filmEdit/data', value) }
    },
    options: {
      get () { return this.$store.state.filmEdit.options },
      set (value) { this.$store.commit('filmEdit/options', value) }
    },
    selected: {
      get () { return this.$store.state.filmEdit.selected },
      set (value) { this.$store.commit('filmEdit/selected', value) }
    },
    release_date: {
      get () { return this.$store.getters['filmEdit/release_date'] },
      set (value) { this.$store.commit('filmEdit/release_date', value ? value.toISOString() : null) }
    },
    created: {
      get () { return this.$store.getters['filmEdit/created'] },
      set (value) { this.$store.commit('filmEdit/created', value ? value.toISOString() : null) }
    },
    edited: {
      get () { return this.$store.getters['filmEdit/edited'] },
      set (value) { this.$store.commit('filmEdit/edited', value ? value.toISOString() : null) }
    }
  },
  methods: {
    ...mapActions('filmEdit', {
      init: 'init',
      saveFilm: 'saveFilm'
    })
  }
}
</script>
