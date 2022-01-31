<template>
  <div :key="$route.path">
    <app-dialog-confirm ref="confirm" />
    <h1 class="display-1 text-uppercase">
      {{ pageTitle }}
    </h1>

    <div class="d-flex justify-end mb-5">
      <v-btn
        v-if="$router.match({name: actionNames.create}).matched.length > 0"
        small
        color="primary"
        fab
        title="Adicionar novo registro"
        :to="{ name: actionNames.create }"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-divider class="my-5" />

    <model-search
      v-if="searchSchema.length > 0"
      :search-schema="searchSchema"
      @submit="(params) => paginate({ page: 1, ...params })"
    />

    <template v-if="loading.fetch">
      <v-row>
        <v-col
          v-for="i in 8"
          :key="i"
          :lg="3"
          :md="6"
          :cols="12"
        >
          <v-skeleton-loader
            type="card"
          />
        </v-col>
      </v-row>
    </template>
    <template v-else-if="models">
      <v-alert>
        <v-layout
          justify-space-between
          align-center
        >
          <div>
            Página {{ models.current_page }} de {{ models.last_page }}
          </div>
          <div>
            Total de
            {{ models.total }}
          </div>
        </v-layout>
      </v-alert>

      <v-row>
        <v-col
          v-for="model in models.data"
          :key="model.id"
          :lg="3"
          :md="6"
          :cols="12"
        >
          <slot
            name="model"
            v-bind="{ model }"
          >
            <model-list-item
              :edit-route="{ name: actionNames.edit, params: { id: model.id } }"
              :show-route="{ name: actionNames.show, params: { id: model.id } }"
              :fields="fields"
              :model="model"
              v-bind="{ ...preparedModel(model) }"
              @removed="() => remove(model)"
            />
          </slot>
        </v-col>
      </v-row>
      <div
        v-if="models.last_page > 1"
        class="mt-5"
      >
        <v-pagination
          v-model="models.current_page"
          :length="models.last_page"
          circle
          @input="(page) => paginate({page})"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">

import Resource from '../services/resource'
import ModelSearch from '../components/ModelSearch.vue'
import ModelListItem from '../components/ModelListItem.vue'
import AppDialogConfirm from '../components/AppDialogConfirm.vue'
import Vue, { PropType, VueConstructor } from 'vue'
import { Model, Paginated } from '../types/laravel'
import { IndexRouteProps, ResourceActionNames } from '../types/router'
import { SearchSchema } from '@/types/schema'

interface Refs
{
    $refs: {
        confirm: InstanceType<typeof AppDialogConfirm>,
    }
}

function useStringOrCallback (
  model: Model,
  prop: IndexRouteProps['itemTitleProp'] | IndexRouteProps['itemImageProp']
) : string | null {
  if (typeof prop === 'function') {
    return prop(model)
  } else if (typeof prop === 'string') {
    return model[prop]
  }

  return null
}

export default (Vue as VueConstructor<Vue & Refs>).extend({

  name: 'ModelList',
  components: {
    AppDialogConfirm,
    ModelListItem,
    ModelSearch
  },

  props: {
    resource: {
      type: Resource,
      required: true
    },

    pageTitle: {
      type: String,
      required: true
    },

    actionNames: {
      type: Object as PropType<ResourceActionNames>,
      required: true
    },
    itemTitleProp: {
      type: [String, Function] as PropType<IndexRouteProps['itemTitleProp']>,
      default: 'name'
    },
    itemImageProp: {
      type: Object as PropType<IndexRouteProps['itemImageProp']>,
      default: null
    },

    fields: {
      type: Array as PropType<IndexRouteProps['fields']>,
      required: true
    },

    searchSchema: {
      type: Array as PropType<SearchSchema[]>,
      default: () => []
    }
  },

  data () {
    return {
      models: { data: [] as Model[] } as Paginated,
      loading: { fetch: false }
    }
  },

  watch: {
    $route () {
      this.models = { data: [] as Model[] } as Paginated
      this.paginate()
    }
  },

  created () {
    this.paginate()
  },

  methods: {

    preparedModel (model: Model) {
      return {
        title: useStringOrCallback(model, this.itemTitleProp),
        image: useStringOrCallback(model, this.itemImageProp)
      }
    },

    async paginate (params: any = {}) {
      this.loading.fetch = true
      try {
        this.models = await this.resource.paginated(params)
      } finally {
        this.loading.fetch = false
      }
    },

    async remove (model: Model) {
      const ok: boolean = await this.$refs.confirm.open({
        text: 'Deseja remover esse model?'
      })

      if (!ok) return

      await this.resource.delete(model.id)

      const index = this.models.data.indexOf(model)

      this.models.data.splice(index, 1)
    },

    getImage (model: Model) {
      return model[this.itemImageProp] ?? 'failed.png'
    }

  }
})
</script>
