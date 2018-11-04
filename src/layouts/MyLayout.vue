<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Star Wars - SSR & PWA
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Essential Links</q-list-header>
        <q-item :to="{ name: 'people' }">
          <q-item-side letter="P" />
          <q-item-main label="People" />
        </q-item>
        <q-item :to="{ name: 'films' }">
          <q-item-side letter="F" />
          <q-item-main label="Films" />
        </q-item>
        <q-item :to="{ name: 'starships' }">
          <q-item-side letter="S" />
          <q-item-main label="Starships" />
        </q-item>
        <q-item :to="{ name: 'vehicles' }">
          <q-item-side letter="V" />
          <q-item-main label="Vehicles" />
        </q-item>
        <q-item :to="{ name: 'species' }">
          <q-item-side letter="S" />
          <q-item-main label="Species" />
        </q-item>
        <q-item :to="{ name: 'planets' }">
          <q-item-side letter="P" />
          <q-item-main label="Planets" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  }
}
</script>

<style>
</style>
