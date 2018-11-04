import Vue from 'vue'
import Vuex from 'vuex'
import columns from './columns'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  return new Vuex.Store({
    modules: {
      columns
    }
  })
}
