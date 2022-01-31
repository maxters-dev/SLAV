import { titleCase } from '@/helpers';
import { Model } from '@/types/laravel';
import { InputSchemaProperties } from '@/types/schema';
import Vue from 'vue';

function prepareVSelectField(component: Vue, inputSchema: InputSchemaProperties) {

    inputSchema.props = { ...inputSchema.props, items: [], loading: false }


    if (inputSchema.multiple) {

        inputSchema.props = {
            hideNoData: true,
            hideDetails: true,
            chips: true,
            itemText: 'name',
            itemValue: 'id',
            search: undefined,
            ...inputSchema.props,
        }
    }

    if (typeof inputSchema.items === 'function') {


        inputSchema.props.loading = true;

        inputSchema.items().then((items: Model[]) => {
            inputSchema.props.items = items
            component.$forceUpdate();
        }).finally(() => inputSchema.props.loading = false)
    }
}

function prepareVAutocompleteField(component: Vue, inputSchema: InputSchemaProperties) {

    inputSchema.props = { items: [], loading: false, ...inputSchema.props }
    inputSchema._listeners ??= {};

    if (inputSchema.multiple) {
        Object.assign(inputSchema.props, {
            chips: true,
            itemText: 'name',
            itemValue: 'id',
            cached: true
        })
    }

    if (typeof inputSchema.search === 'function') {

        inputSchema._listeners['update:search-input'] = async (term: string) => {

            inputSchema.props.loading = true;

            try {
                inputSchema.props.items = await inputSchema.search(term)
                component.$forceUpdate();
            } finally {
                inputSchema.props.loading = false;
            }

        };
    }
}

export function prepareFieldProperties(component: Vue, inputSchema: InputSchemaProperties) {

    const label = titleCase(inputSchema.label || inputSchema.placeholder || inputSchema.name);

    const props = {
        required: typeof inputSchema.component === 'string' && ['VTextarea', 'VSelect', 'VTextField'].includes(inputSchema.component),
        ...inputSchema,
        label,
    };

    delete props.component;

    inputSchema.props = props;

    if ('VSelect' === inputSchema.component) {
        prepareVSelectField(component, inputSchema)
    } else if ('VAutocomplete' === inputSchema.component) {
        prepareVAutocompleteField(component, inputSchema);
    }
}
