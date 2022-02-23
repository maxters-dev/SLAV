<template>
    <div>
        <h4 class="mb-5 display-1 text-uppercase">
            {{ pageTitle }}
        </h4>
        <v-card :loading="loading">
            <v-card-text>
                <model-description-list
                    v-if="model"
                    :model="model"
                    :fields="fields"
                />
                <v-skeleton-loader
                    v-else
                    type="list-item@5"
                />
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Resource from '../services/resource';
import { FieldViewSchema } from '../types/schema';
import { Model } from '../types/laravel';
import ModelDescriptionList from '../components/ModelDescriptionList.vue';

export default Vue.extend({
    name: 'ModelShow',
    components: { ModelDescriptionList },
    props: {
        pageTitle: {
            type: String,
            required: true
        },
        fields: {
            type: [Array, Function] as PropType<FieldViewSchema[]>,
            required: true
        },
        resource: {
            type: Resource,
            required: true
        }
    },
    data () {
        return {
            model: null as Model | null
        };
    },

    computed: {
        id (): number {
            return parseInt(this.$route.params.id, 10);
        },
        loading (): boolean {
            return this.model === null;
        }
    },

    async created () {
        this.model = await this.resource.show(this.id);
    }
});
</script>
