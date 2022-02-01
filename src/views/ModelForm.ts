
import { titleCase } from '../helpers';
import { InputSchemaProperties } from '../types/schema';

export function createFieldDefinition (inputSchemaProps: InputSchemaProperties) {
    const label = titleCase(
        inputSchemaProps.label || inputSchemaProps.placeholder || inputSchemaProps.name
    );

    const required = typeof inputSchemaProps.component === 'string' &&
        ['VTextarea', 'VSelect', 'VTextField'].includes(
            inputSchemaProps.component
        );

    const props = {
        required,
        ...inputSchemaProps,
        label
    };

    delete props.component;
    delete props.listeners;
    delete props.transformValue;

    if (['VSelect', 'VAutocomplete'].includes(inputSchemaProps.component as string)) {
        Object.assign(props, {
            ...props,
            hideNoData: true,
            hideDetails: true,
            chips: inputSchemaProps.multiple === true,
            itemText: 'name',
            itemValue: 'id',
            search: undefined,
            items: []
        });
    }

    return props;
}
