<template>
  <form @submit.prevent="save">
    <h1 class="display-1 text-uppercase">
      {{ pageTitle }}
    </h1>
    <v-divider class="my-5" />
    <v-card
      :loading="loading.fetch"
      :disabled="loading.fetch"
    >
      <v-card-text>
        <div
          v-for="field in computedFields"
          :key="field.name"
        >
          <component
            :is="field.component"
            v-model="model[field.name]"
            v-bind="field.props"
            v-on="listeners(field)"
          />
        </div>
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            :loading="loading.saving"
            type="submit"
          >
            Salvar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </form>
</template>

<script lang="ts">

import Vue, { PropType } from 'vue'
import { EventBus } from '@/services/event-bus'

import { prepareFieldProperties } from '@/views/ModelForm'
import Resource from '@/services/resource'

import AppDatePicker from '../components/AppDatePicker.vue'
import { VAutocomplete, VTextField, VTextarea, VSelect, VChip, VSwitch } from 'vuetify/lib'
import { InputSchema, InputSchemaProperties } from '@/types/schema'

export default Vue.extend({
  name: 'ModelForm',
  components: {
    VTextField,
    VTextarea,
    VSelect,
    VChip,
    VSwitch,
    AppDatePicker,
    VAutocomplete
  },

  props: {
    formSchema: {
      type: Array as PropType<InputSchema[]>,
      default: () => []
    },
    pageTitle: {
      type: String,
      required: true
    },

    resource: {
      type: Resource,
      required: true
    },

    indexRoute: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      computedFields: [] as Array<any>,
      model: {} as any,
      loading: { fetch: false, saving: false } as { fetch: Boolean, saving: Boolean }
    }
  },

  computed: {
    id (): number | null {
      const id = this.$route.params.id
      return id ? parseInt(id, 10) : null
    }
  },

  async created () {
    await this.fetchData()
    this.computedFields = this.getComputedFields()
  },
  methods: {

    getComputedFields (): InputSchemaProperties[] {
      return this.formSchema.map((field: InputSchema) => {
        if (typeof field === 'function') {
          field = field({ model: this.model, component: this }) as InputSchemaProperties
        }

        prepareFieldProperties(this, field)

        return { component: 'VTextField', ...field }
      })
    },

    async save () {
      this.loading.saving = true

      try {
        if (this.id) {
          await this.resource.update(this.id, this.model)
        } else {
          await this.resource.create(this.model)
        }
      } finally {
        this.loading.saving = false
      }

      EventBus.$emit('$toast', 'Dados salvos com sucesso!')

      this.$router.push({ name: this.indexRoute })
    },

    async fetchData () {
      if (!this.id) return

      this.loading.fetch = true

      try {
        const model = await this.resource.show(this.id)

        this.computedFields.forEach((field) => {
          if (field.transformValue) {
            model[field.name] = field.transformValue(model[field.name], model)
          }
        })

        this.model = model
      } finally {
        this.loading.fetch = false
      }
    },

    listeners (field: InputSchemaProperties) {
      let listeners = {}

      // O listener deve retornar uma função ou objeto
      if (typeof field.listeners === 'function') {
        Object.assign(listeners, field.listeners({ model: this.model, component: this }))
      } else if (typeof field.listeners === 'object') {
        listeners = field.listeners
      }

      return { ...listeners, ...field._listeners }
    }
  }
})
</script>
