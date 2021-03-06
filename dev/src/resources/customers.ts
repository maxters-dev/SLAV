import { RouteResource } from '../../../';
import { addTimestampsFields } from '../../../src/helpers/schema/ptBr';
import { FieldViewListSchema, FormSchema } from '../../../src/types/schema';
import authSessionService from '../../../src/services/auth';
import customerObjectives from './customer-objectives';

const genders = [{ text: 'Masculino', value: 'M' }, { text: 'Feminino', value: 'F' }];

const detailsSchema: FieldViewListSchema = [
    { title: 'Celular', name: 'phone' },
    { title: 'E-mail', name: 'user.email' },
    { title: 'Objetivos', name: 'objectives_count' }
    // { title: 'Progresso', name: 'fake_progress_field', type: 'progress', format: () => Math.random() * 100 }
    // { title: 'Avaliações', name: 'fake_rate_field', type: 'rate', format: () => Math.random() * 5 }
];

const fullDetailsSchema = addTimestampsFields([
    { title: 'Nome Completo', name: 'user.name' },
    ...detailsSchema,
    { title: 'Endereço', name: 'address' }
]);

const searchSchema = [
    { name: 'contains[user.name]', label: 'Nome' },
    { name: 'exact[user.email]', label: 'CPF' },
    { name: 'contains[user.email]', label: 'E-mail', type: 'email' },
    {
        name: 'exact[gender]',
        label: 'Gênero',
        defaultValue: 'F',
        items: [{ name: 'Todos', id: '' }, { name: 'Masculino', id: 'M' }, { name: 'Feminino', id: 'F' }],
        component: 'VSelect'
    }
];

const formSchema: FormSchema = () => ([
    { name: 'user.name', label: 'Nome' },
    {
        name: 'only_male',
        component: 'VCheckbox',
        label: 'Only Male',
        dense: true
    },
    {
        name: 'gender',
        label: 'Gênero',
        component: 'VSelect',
        itemValue: 'value',
        multiple: false,
        itemText: 'text',
        items: genders
    },
    { name: 'cpf', label: 'CPF', maxlength: 11, mask: '###.###.###-##', type: 'tel' },
    { name: 'birth_date', label: 'Data de Nascimento', type: 'date', component: 'AppDatePicker' },
    { name: 'user.email', label: 'E-mail' },
    { name: 'phone', label: 'Celular', counter: 11, maxlength: 11, type: 'tel', appendIcon: 'mdi-phone' },
    { name: 'address', label: 'Endereço', appendIcon: 'mdi-map' }
]);

const routeResource = new RouteResource({
    name: 'Customers',
    prefixName: 'prefix',
    pluralTitle: 'Clientes',
    propertyTitleValue: 'user.name',
    propertyImageValue: 'user.avatar_url',
    formSchema,
    searchSchema,
    detailsSchema,
    fullDetailsSchema,

    async handleAuthorizations () {
        const user = await authSessionService.getUser(true);
        return {
            create: () => true,
            edit: (model) => [2, 3].includes(user.role_id) && model.user_creator_id === user.id
        };
    }
});

routeResource
    .addNested('mdi-trophy-outline', customerObjectives)
    .addNested('mdi-arrow-right', {
        name: 'CustomerObjectiveItems',
        pluralTitle: 'Metas do Objetivo',
        propertyTitleValue: 'month_year',
        fullDetailsSchema: [
            { name: 'month', title: 'Mes' }
        ],

        create: false,
        edit: false,
        remove: false
    });

export default routeResource;
