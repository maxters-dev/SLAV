<template>
  <div>
    <component
      :is="inputSchemaProperties.component || 'VTextField'"
      v-model="value"
      v-bind="reactiveProps"
      v-on="listeners"
    />
  </div>
</template>

<script lang="ts" >
import Vue, { PropType } from 'vue';
import { Model } from '@/types/laravel';
import { InputSchema, InputSchemaProperties } from '@/types/schema';
import { createFieldDefinition } from './ModelForm';

import AppDatePicker from '../components/AppDatePicker.vue';
import {
    VAutocomplete,
    VTextField,
    VTextarea,
    VSelect,
    VChip,
    VSwitch
} from 'vuetify/lib';

export default Vue.extend({
    name: 'ModelFormField',

    inheritAttrs: false,

    components: {
        VTextField,
        VTextarea,
        VSelect,
        VChip,
        VSwitch,
        AppDatePicker,
        VAutocomplete
    },
    data () {
        return {
            reactiveProps: {} as any,
            listeners: {} as any
        };
    },

    created () {
        this.enableAutocompleteSearch();
        this.generateFieldDefinition();
        this.lazyLoadItemsFromCallback();
    },

    props: {
        inputSchema: {
            type: [Object, Function] as PropType<InputSchema>
        },
        modelValue: {
            type: null as any,
            required: true
        },
        model: {
            type: Object as PropType<Model>,
            required: true
        }
    },

    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },

    methods: {
        generateFieldDefinition () {
            const props = createFieldDefinition(this.inputSchemaProperties);

            if (this.inputSchemaProperties.transformValue) {
                this.value = this.inputSchemaProperties.transformValue(this.value, this.model);
            }

            this.reactiveProps = props;

            this.listeners = { ...this.listeners, ...this.getListenersFromInputSchema() };
        },

        getListenersFromInputSchema (): any {
            if (typeof this.inputSchemaProperties.listeners === 'function') {
                return this.inputSchemaProperties.listeners({
                    model: this.model,
                    component: this
                });
            }
            return this.inputSchemaProperties.listeners;
        },

        async lazyLoadItemsFromCallback () {
            if (typeof this.inputSchemaProperties.items !== 'function') return;

            this.reactiveProps.loading = true;

            try {
                const items: Model[] = await this.inputSchemaProperties.items();
                this.reactiveProps.items = items;
            } finally {
                this.reactiveProps.loading = false;
            }
        },
        enableAutocompleteSearch () {
            if (typeof this.inputSchemaProperties.search !== 'function') return;

            const searchCallback = async (term: string) => {
                this.reactiveProps.loading = true;

                try {
                    this.reactiveProps.items = await this.inputSchemaProperties.search(term);
                } finally {
                    this.reactiveProps.loading = false;
                }
            };

            this.listeners = {
                ...this.listeners,
                'update:search-input': searchCallback
            };
        }
    },

    computed: {
        value: {
            set (value: any) {
                this.$emit('update:modelValue', value);
            },

            get (): any {
                return this.modelValue;
            }
        },
        inputSchemaProperties (): InputSchemaProperties {
            if (typeof this.inputSchema === 'function') {
                return this.inputSchema({
                    model: this.model,
                    component: this
                }) as InputSchemaProperties;
            }

            return this.inputSchema;
        }
    }
});
</script>
