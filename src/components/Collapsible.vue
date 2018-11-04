<template>
  <q-collapsible :label="name" :opened="true">
    <div class="row">
      <q-field class="col-xs-12 col-sm-7 col-md-8 col-lg-9">
        <q-select multiple filter v-model="newItens" :float-label="'Select ' + name" :options="_options" :after="after" />
      </q-field>
      <div class="q-px-md q-pt-md col-xs-12 col-sm-5 col-md-4 col-lg-3">
        <q-btn style="width: 100%" flat color="primary" label="Add Planets" icon="send" @click="addItem" />
      </div>
      <div v-for="(value, index) in selected" :key="value" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-list class="q-ma-none q-pa-none">
          <q-item>
            <q-item-main>
              <q-item-tile label>{{ getLabel(value) }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn outline round dense icon="edit" class="q-ml-xs" color="primary" :to="{ name: edit, params: { id: value } }" />
              <q-btn outline round dense icon="close" class="q-ml-xs" color="negative" @click="removeItem(index)" />
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-collapsible>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  props: {
    name: String,
    edit: String,
    options: Array,
    value: Array
  },
  data () {
    var that = this
    return {
      newItens: [],
      selected: [],
      after: [{
        icon: 'close',
        content: true,
        handler () {
          that.$set(that, 'newItens', [])
        }
      }]
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler () {
        this.selected = this.value
      }
    },
    selected: {
      deep: true,
      handler () {
        this.$emit('input', this.selected)
      }
    }
  },
  computed: {
    _options () {
      return this.options.filter((item) => {
        return this.selected.findIndex(id => id === item.value) === -1
      })
    }
  },
  methods: {
    addItem () {
      this.newItens.forEach(id => this.selected.push(id))
      this.$set(this, 'newItens', [])
    },
    removeItem (index) {
      this.selected.splice(index, 1)
    },
    getLabel (value) {
      return this.options.find(item => item.value === value).label
    }
  }
}
</script>
