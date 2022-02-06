import { createRouteResource } from '../../../src/router-resource';

/**
 * Definir as propriedades do show como array
 * Definir as propriedades do index como array
 *
 */
export default createRouteResource({
    name: 'customerObjectiveItems',
    propertyTitleValue: 'month_year',
    singularTitle: 'Meta Mensal do Objetivo',
    fullDetailsSchema: [
        { name: 'year', title: 'Ano' },
        { name: 'month', title: 'Mês' },
        { name: 'value', title: 'Valor', format: (value) => `R$ ${value}` }
    ],
    formSchema: [
        { name: 'year', label: 'Ano' },
        { name: 'month', label: 'Mês', min: 1, max: 12, type: 'number' },
        { name: 'value', label: 'Valor', prefix: 'R$', type: 'number', step: 0.01 }
    ],
    searchSchema: [
        { name: 'exact[year]', label: 'Ano', defaultValue: new Date().getFullYear() },
        {
            name: 'exact[month]',
            label: 'Mês',
            defaultValue: new Date().getMonth() + 1,
            component: 'VSelect',
            itemText: 'text',
            itemValue: 'value',
            items: [
                { text: 'Janeiro', value: 1 },
                { text: 'Fevereiro', value: 2 }
            ]
        },
        { name: 'contains[user.email]', label: 'E-mail', type: 'email' },
        { name: 'exact[gender]', label: 'Gênero', items: [{ name: 'Masculino', id: 1 }, { name: 'Feminino', id: 2 }], component: 'VSelect' }
    ],
    index: props => ({ ...props, pageTitle: 'Metas Mensais' })
});