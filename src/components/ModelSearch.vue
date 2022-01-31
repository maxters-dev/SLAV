<template>
  <form @submit.prevent="submit">
    <v-row
      align="center"
    >
      <v-col :md="7">
        <v-text-field
          v-model="searchValue"
          placeholder="Pesquisar"
          append-icon="mdi-magnify"
          @click:append="submit"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="searchField"
          :items="searchSchema"
          item-value="value"
          item-text="text"
        />
      </v-col>
      <v-col
        cols="auto"
      >
        <v-btn
          type="submit"
          color="primary"
        >
          Pesquisar
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import { SearchSchema } from '@/types/schema'
import Vue, { PropType } from 'vue'

export default Vue.extend({

    name: 'ModelSearch',

    props: {
        searchSchema: {
            type: Array as PropType<SearchSchema[]>,
            required: true
        }
    },

    data() {
        return {
            searchValue: '' as string,
            searchField: this.searchSchema[0].value as string,
        }
    },

    methods: {
        submit() {
            this.$emit('submit', { [this.searchField]: this.searchValue })
        }
    }
})

</script>
