import { ResourceRouteConfig } from '../../../src/types';

export default {
    name: 'customerObjectives',
    propertyTitleValue: 'month_year',
    pluralTitle: 'Objetivos do Cliente',
    fullDetailsSchema: [
        { name: 'items_count', title: 'Parcelas' },
        { name: 'items_filled_count', title: 'Parcelas' }
    ],
    formSchema: [
        { name: 'name', label: 'Nome' }
    ]
} as ResourceRouteConfig;
