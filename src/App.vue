<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  preFetch ({ store, ssrContext }) {
    return store.dispatch('app/init')
  },
  mounted () {
    if (!this.loaded) {
      this.$store.dispatch('app/init')
    }
  },
  computed: {
    ...mapState('app', {
      loaded: (state) => process.env.SERVER || state.loaded.local
    })
  }
}
</script>

<style>
</style>
