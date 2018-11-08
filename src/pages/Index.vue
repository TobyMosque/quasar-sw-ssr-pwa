<template>
  <q-page class="flex flex-center">
  </q-page>
</template>

<style>
</style>

<script>
import indexModule from '../store/pages/index'
export default {
  name: 'PageIndex',
  preFetch ({ store, ssrContext }) {
    if (!store.state.index) {
      store.registerModule('index', indexModule)
    }
    return store.dispatch('index/init')
  }
}
</script>
