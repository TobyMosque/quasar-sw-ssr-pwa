<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="$router.push('/')"
    >Go back</q-btn>
  </div>
</template>

<script>
import error404Module from '../store/pages/error404'
export default {
  name: 'Error404',
  preFetch ({ store, ssrContext }) {
    if (!store.state.error404) {
      store.registerModule('error404', error404Module)
    }
    return store.dispatch('error404/init')
  }
}
</script>
