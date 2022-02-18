<template>
    <div :key="$route.path">
        <app-dialog-confirm ref="confirm" />

        <h1 class="display-1 text-uppercase">
            {{ pageTitle }}
        </h1>

        <div class="d-flex justify-end mb-5">
            <v-btn
                v-if="routeIsEnabled('create', actionNames.create)"
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
            @submit="search"
        />

        <transition
            mode="out-in"
            name="fade-transition"
            :duration="50"
        >
            <div
                v-if="loading.fetch"
                key="loading"
            >
                <model-list-loading />
            </div>
            <section
                v-else
                :key="`page-${models.current_page}`"
            >
                <v-alert v-if="models.total > 0">
                    <v-layout
                        justify-space-between
                        align-center
                    >
                        <div>Página {{ models.current_page }} de {{ models.last_page }}</div>
                        <div>
                            Total de
                            {{ models.total }}
                        </div>
                    </v-layout>
                </v-alert>
                <v-alert v-else-if="models.total === 0">
                    Nenhum resultado encontrado
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
                                :actions-authorization="actionsAuthorization"
                                :custom-actions="customActions"
                                :action-names="actionNames"
                                :fields="fields"
                                :model="model"
                                v-bind="{ ...useImageAndTitle(model) }"
                                @removed="() => remove(model)"
                            />
                        </slot>
                    </v-col>
                </v-row>
                <v-pagination
                    v-if="models.last_page > 1"
                    v-model="models.current_page"
                    :length="models.last_page"
                    circle
                    class="mt-5"
                    @input="(page) => paginate(page)"
                />
            </section>
        </transition>
    </div>
</template>

<script lang="ts">
import modelIndex from '../../src/mixins/modelIndex';
import AppDialogConfirm from '../../src/components/AppDialogConfirm.vue';
import ModelSearch from '../../src/components/ModelSearch.vue';
import ModelListItem from '../../src/components/ModelListItem.vue';
import ModelListLoading from '../../src/components/ModelListLoading.vue';

export default modelIndex.extend({
    components: {
        ModelSearch,
        ModelListLoading,
        ModelListItem,
        AppDialogConfirm
    }
});
</script>
