<template>
  <v-list
    class="pa-0"
    dense
    v-bind="$attrs"
  >
    <v-list-item
      v-for="(field, key) in computedFields"
      :key="key"
    >
      <v-list-item-content
        class="pa-0"
      >
        <v-list-item-title>
          {{ field.title }}
        </v-list-item-title>
        <div v-if="field.type === 'image'">
          <v-img
            :src="field.value"
            :lazy-src="field.value"
            :height="450"
            position="top"
          />
        </div>
        <div
          v-else-if="field.type === 'html'"
          v-html="field.value"
        />
        <div
          v-else-if="Array.isArray(field.value)"
          class="mt-2"
        >
          <v-chip
            v-for="value in field.value"
            :key="value"
            small
            class="mr-2"
          >
            {{ value }}
          </v-chip>
        </div>
        <v-list-item-subtitle
          v-else
          class="font-weight-light"
        >
          {{ field.value }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">

import Vue, { PropType } from 'vue'
import { FieldConfig } from '../types/schema'
import { FieldResult } from '../types/components/model'
import { Model } from '../types/laravel'

export default Vue.extend({
  name: 'ModelFields',
  props: {

    fields: {
      type: Array as PropType<FieldConfig[]>,
      required: true
    },

    model: {
      type: Object as PropType<Model>,
      required: true
    }
  },

  computed: {
    computedFields (): FieldResult[] {
      return this.fields.map((field): FieldResult => {
        return {
          title: field.title,
          type: field.type,
          value: this.processFieldValue(field, this.model)
        }
      })
    }
  },

  methods: {
    processFieldValue (field: FieldConfig, model: Model) {
      let result = model[field.name] ?? null

      if (typeof field.format === 'function') {
        result = field.format(result, model)
      }
      return result
    }
  }
})
</script>
