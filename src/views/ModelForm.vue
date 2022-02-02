<template>
    <form @submit.prevent="save">
        <h1 class="display-1 text-uppercase">
            {{ pageTitle }}
        </h1>
        <v-divider class="my-5" />
        <v-card :loading="loading.fetch" :disabled="loading.fetch">
            <v-card-text>
                <model-form-field
                    :input-schema="item"
                    @update:modelValue="(value) => setModelPropValue(item.name, value)"
                    :model-value="getModelPropValue(item.name)"
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
        </v-card>
    </form>
</template>

<script lang="ts">
import { Model } from '@/types/laravel';
import Vue, { PropType } from 'vue';
import { EventBus } from '../services/event-bus';

import Resource from '../services/resource';

import { FormSchema, InputSchema } from '../types/schema';
import ModelFormField from './ModelFormField.vue';

export default Vue.extend({

    components: { ModelFormField },
    name: 'ModelForm',

    props: {
        formSchema: {
            type: [Object, Function] as PropType<FormSchema>,
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
        await this.fetchData();
        this.inputSchemas = this.getFormSchemaAsArray();
    },

    methods: {

        setModelPropValue (name: string, value: any) {
            let deepValue = this.model;
            const names: string[] = name.split('.');
            const targetProp = names.pop() as string;

            names.forEach((key: string) => {
                deepValue = deepValue[key] as Model;
            });

            deepValue[targetProp] = value;
        },

        getModelPropValue (name: string) {
            let deepValue = this.model;

            name.split('.').forEach((key: string) => {
                deepValue = deepValue[key];
            });

            return deepValue;
        },

        getFormSchemaAsArray (): InputSchema[] {
            if (typeof this.formSchema === 'function') {
                return this.formSchema({ model: this.model, component: this });
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

        async fetchData () {
            if (!this.id) return;

            this.loading.fetch = true;

            try {
                this.model = await this.resource.show(this.id);
            } finally {
                this.loading.fetch = false;
            }
        }
    }
});
</script>
