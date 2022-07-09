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
            <transition
                name="slide-y-transition"
                mode="out-in"
            >
                <v-card-text
                    v-if="loading.fetch"
                    key="skeleton"
                >
                    <v-skeleton-loader
                        v-for="x in 5"
                        :key="x"
                        class="mb-2"
                        type="list-item"
                    />
                </v-card-text>
                <v-card-text
                    v-else
                    key="fields"
                >
                    <model-form-field
                        v-for="(item, key) in inputSchemas"
                        :key="`model-form-field-${key}`"
                        :input-schema="item"
                        :model-value="getModelPropValue(item)"
                        :model="model"
                        @update:modelValue="(value) => setModelPropValue(item, value)"
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
import { Model, Payload } from '../types/laravel';

export default Vue.extend({
    name: 'ModelForm',

    components: { ModelFormField },

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
        },

        hasUpload: Boolean
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

        prepareData (model: any): Payload {
            if (!this.hasUpload) return model;

            const form = new FormData();

            Object.entries(model).forEach(([key, value]) => {
                if (value === undefined) {
                    form.append(key, '');
                } else if (typeof value === 'boolean') {
                    form.append(key, value ? '1' : '0');
                } else if (value instanceof File) {
                    form.append(key, value, value.name);
                } else {
                    form.append(key, value as string | Blob);
                }
            });

            return form;
        },

        async save () {
            this.loading.saving = true;

            const payload = this.prepareData(this.model);

            try {
                if (this.id) {
                    await this.resource.update(this.id, payload);
                } else {
                    await this.resource.create(payload);
                }
            } finally {
                this.loading.saving = false;
            }

            EventBus.$emit('message', 'Dados salvos com sucesso!');

            this.back();
        },

        back () {
            this.$router.push({
                name: this.indexRoute
            });
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
