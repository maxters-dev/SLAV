<template>
    <div>
        <component
            :is="inputSchemaProperties.component || 'VTextField'"
            v-bind="reactiveProps"
            ref="input"
            v-model="value"
            v-on="listeners"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Model } from '../types/laravel';
import { InputSchema, InputSchemaProperties } from '../types/schema';

import AppImageUpload from '../components/AppImageUpload.vue';
import AppDatePicker from '../components/AppDatePicker.vue';
import AppRichTextEditor from '../components/AppRichTextEditor.vue';
import {
    VAutocomplete,
    VCheckbox,
    VTextField,
    VTextarea,
    VSelect,
    VChip,
    VSwitch
} from 'vuetify/lib';
import { titleCase } from '../helpers';

export default Vue.extend({
    name: 'ModelFormField',

    components: {
        AppImageUpload,
        AppDatePicker,
        AppRichTextEditor,
        VTextField,
        VTextarea,
        VSelect,
        VChip,
        VCheckbox,
        VSwitch,
        VAutocomplete
    },

    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },

    props: {
        inputSchema: {
            type: [Object, Function] as PropType<InputSchema>,
            required: true
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
    data () {
        return {
            reactiveProps: {} as any,
            listeners: {} as any
        };
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
    },

    created () {
        this.enableAutocompleteSearch();
        this.generateFieldDefinition();
        this.enableSelectOptions();
    },

    methods: {

        createFieldDefinition () {
            const inputSchemaProps = this.inputSchemaProperties;

            const required = ['VTextarea', 'VSelect', 'VTextField'].includes(inputSchemaProps.component as string);

            let props = {
                required,
                label: titleCase(inputSchemaProps.name),
                ...inputSchemaProps
            } as any;

            delete props.component;
            delete props.listeners;
            delete props.transformValue;
            delete props.defaultValue;

            if (['VSelect', 'VAutocomplete'].includes(inputSchemaProps.component as string)) {
                props = {
                    hideNoData: true,
                    chips: inputSchemaProps.multiple === true,
                    itemText: 'name',
                    itemValue: 'id',
                    search: undefined,
                    items: [],
                    ...props
                };
            }

            return props;
        },
        generateFieldDefinition () {
            const props = this.createFieldDefinition();

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

        async enableSelectOptions () {
            if (Array.isArray(this.inputSchemaProperties.items)) {
                this.reactiveProps.items = this.inputSchemaProperties.items;
                return;
            }

            if (typeof this.inputSchemaProperties.items !== 'function') return;
            this.reactiveProps.loading = true;

            try {
                const items: Model[] = await this.inputSchemaProperties.items(this.model);
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
                    this.reactiveProps.items = await this.inputSchemaProperties.search(term, this.model);
                } finally {
                    this.reactiveProps.loading = false;
                }
            };

            this.listeners = {
                ...this.listeners,
                'update:search-input': searchCallback
            };
        }

    }
});
</script>
