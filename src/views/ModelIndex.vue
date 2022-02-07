<template>
  <div :key="$route.path">
    <app-dialog-confirm ref="confirm" />
    <h1 class="display-1 text-uppercase">
      {{ pageTitle }}
    </h1>

    <div class="d-flex justify-end mb-5">
      <v-btn
        v-if="routeIsEnabled(actionNames.create)"
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
      v-model="searchParams"
      :search-schema="searchSchema"
      @submit="paginate({ page: 1, ...searchParams })"
    />

    <template v-if="loading.fetch">
      <v-row>
        <v-col v-for="i in 8" :key="i" :lg="3" :md="6" :cols="12">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>
    </template>
    <template v-else-if="models">
      <v-alert>
        <v-layout justify-space-between align-center>
          <div>Página {{ models.current_page }} de {{ models.last_page }}</div>
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
          <slot name="model" v-bind="{ model }">
            <model-list-item
              :edit-route="{ name: actionNames.edit, params: { id: model.id } }"
              :show-route="{ name: actionNames.show, params: { id: model.id } }"
              :actionsAuthorization="actionsAuthorization"
              :action-names="actionNames"
              :fields="fields"
              :model="model"
              v-bind="{ ...preparedModel(model) }"
              @removed="() => remove(model)"
            />
          </slot>
        </v-col>
      </v-row>
      <div v-if="models.last_page > 1" class="mt-5">
        <v-pagination
          v-model="models.current_page"
          :length="models.last_page"
          circle
          @input="(page) => paginate({ page, ...searchParams })"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Resource from '../services/resource';
import ModelSearch from '../components/ModelSearch.vue';
import ModelListItem from '../components/ModelListItem.vue';
import AppDialogConfirm from '../components/AppDialogConfirm.vue';
import Vue, { PropType, VueConstructor } from 'vue';
import { Model, Paginated } from '../types/laravel';
import { Authorizations, IndexRouteProps, ResourceActionNames, ResourceRouteConfig } from '../types/router';
import { SearchSchema } from '../types/schema';
import { getModelPropValue } from '../helpers';

interface Refs {
  $refs: {
    confirm: InstanceType<typeof AppDialogConfirm>;
  };
}

function useStringOrCallback (
    model: Model,
    prop: ResourceRouteConfig['propertyTitleValue'] | ResourceRouteConfig['propertyImageValue']
): string | null {
    if (typeof prop === 'function') {
        return prop(model);
    } else if (typeof prop !== 'string') return null;

    const result = getModelPropValue(model, prop);

    return typeof result === 'string' ? result : null;
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

        removeEnabled: {
            type: Boolean,
            default: true
        },

        actionNames: {
            type: Object as PropType<ResourceActionNames>,
            required: true
        },

        propertyTitleValue: {
            type: [String, Function] as PropType<ResourceRouteConfig['propertyTitleValue']>,
            default: 'name'
        },

        propertyImageValue: {
            type: Object as PropType<ResourceRouteConfig['propertyImageValue']>,
            default: null
        },

        fields: {
            type: Array as PropType<IndexRouteProps['fields']>,
            required: true
        },

        searchSchema: {
            type: Array as PropType<SearchSchema[]>,
            default: () => []
        },

        handleAuthorizations: {
            type: Function as PropType<ResourceRouteConfig['handleAuthorizations']>,
            default: null
        }
    },

    data () {
        return {
            models: { data: [] as Model[] } as Paginated,
            loading: { fetch: false },
            searchParams: {},

            actionsAuthorization: {} as Authorizations
        };
    },

    watch: {
        '$route.path': {
            immediate: true,
            handler () {
                this.startup();
            }
        }
    },

    methods: {
        async startup () {
            this.models = { data: [] as Model[] } as Paginated;
            this.actionsAuthorization = {};

            if (this.handleAuthorizations) {
                this.actionsAuthorization = await this.handleAuthorizations();
            }

            if (this.searchSchema.length === 0) {
                this.paginate({ page: 1 });
            }
        },
        preparedModel (model: Model) {
            return {
                title: useStringOrCallback(model, this.propertyTitleValue),
                image: useStringOrCallback(model, this.propertyImageValue)
            };
        },

        routeIsEnabled (name: string) {
            const route = this.$router.match({ name });

            return route?.meta?.enabled === true;
        },

        async paginate (params: any = {}) {
            this.loading.fetch = true;
            try {
                this.models = await this.resource.paginated(params);
            } finally {
                this.loading.fetch = false;
            }
        },

        async remove (model: Model) {
            const ok: boolean = await this.$refs.confirm.open({
                text: 'Deseja remover esse model?'
            });

            if (!ok) return;

            await this.resource.delete(model.id);

            const index = this.models.data.indexOf(model);

            this.models.data.splice(index, 1);
        }
    }
});
</script>
