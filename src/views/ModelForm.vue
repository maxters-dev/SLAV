<template>
    <form @submit.prevent="save">
        <h1 class="display-1 text-uppercase">
            {{ pageTitle }}
        </h1>
        <v-divider class="my-5" />
        <v-card :loading="loading.fetch" :disabled="loading.fetch">
            <transition name="slide-y-transition" mode="out-in">
                 <v-card-text v-if="loading.fetch" key="skeleton">
                    <v-skeleton-loader class="mb-2" :key="x" v-for="x in 5" type="list-item" />
                </v-card-text>
                <v-card-text v-else key="fields">
                    <model-form-field
                        :input-schema="item"
                        @update:modelValue="(value) => setModelPropValue(item, value)"
                        :model-value="getModelPropValue(item)"
                        :model="model"
                        v-for="item in inputSchemas" :key="item.name"
                    />
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
            </transition>

        </v-card>
    </form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { EventBus } from '../services/event-bus';

import Resource from '../services/resource';

import { FormSchema, InputSchema, InputSchemaProperties } from '../types/schema';
import ModelFormField from '../components/ModelFormField.vue';
import { getModelPropValue, setModelPropValue } from '../helpers';
import { Model } from '../types/laravel';

export default Vue.extend({

    components: { ModelFormField },
    name: 'ModelForm',

    props: {
        formSchema: {
            type: [Array, Function] as PropType<FormSchema>,
            required: true
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
            inputSchemas: [] as InputSchema[],

            model: {} as any,
            loading: { fetch: false, saving: false } as {
                fetch: boolean;
                saving: boolean;
            }
        };
    },

    computed: {
        id (): number | null {
            const id = this.$route.params.id;
            return id ? parseInt(id, 10) : null;
        }
    },

    async created () {
        const model = {} as Model;
        const originalModel: Model = await this.fetchData();

        this.inputSchemas = this.getFormSchemaAsArray(originalModel);

        this.inputSchemas.forEach(inputSchema => {
            if (typeof inputSchema === 'function') return;

            setModelPropValue(model, inputSchema.name, inputSchema.defaultValue);
        });

        this.model = { ...model, ...originalModel };
    },

    methods: {

        setModelPropValue (inputSchema: InputSchemaProperties, value: any) {
            setModelPropValue(this.model, inputSchema.name, value);
        },

        getModelPropValue (inputSchema: InputSchemaProperties) {
            return getModelPropValue(this.model, inputSchema.name);
        },

        getFormSchemaAsArray (model: Model): InputSchema[] {
            if (typeof this.formSchema === 'function') {
                return this.formSchema({ model, component: this });
            }

            return this.formSchema;
        },

        async save () {
            this.loading.saving = true;

            try {
                if (this.id) {
                    await this.resource.update(this.id, this.model);
                } else {
                    await this.resource.create(this.model);
                }
            } finally {
                this.loading.saving = false;
            }

            EventBus.$emit('message', 'Dados salvos com sucesso!');

            this.$router.push({ name: this.indexRoute });
        },

        mergeModel (model: object) {
            this.model = { ...model, ...this.model };
        },

        async fetchData (): Promise<Model> {
            if (!this.id) return {} as Model;

            this.loading.fetch = true;

            try {
                return await this.resource.show(this.id);
            } finally {
                this.loading.fetch = false;
            }
        }
    }
});
</script>
