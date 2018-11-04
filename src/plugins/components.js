// import something here
import Collapsible from '../components/Collapsible.vue'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.component('edit-collapsible', Collapsible)
}
