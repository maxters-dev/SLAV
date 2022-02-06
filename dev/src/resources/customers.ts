import { createRouteResource } from '../../../src/router-resource';
import { addTimestampsFields } from '../../../src/helpers/schema/ptBr';
import { FieldViewListSchema, FormSchema } from '../../../src/types/schema';

const genders = [{ text: 'Masculino', value: 'M' }, { text: 'Feminino', value: 'F' }];

const detailsSchema: FieldViewListSchema = [
    { title: 'Celular', name: 'phone' },
    { title: 'E-mail', name: 'user.email' },
    { title: 'Progresso', name: 'fake_progress_field', type: 'progress', format: () => Math.random() * 100 },
    { title: 'Avaliações', name: 'fake_rate_field', type: 'rate', format: () => Math.random() * 5 }
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

export default createRouteResource({
    name: 'customers',
    propertyTitleValue: 'user.name',
    formSchema,
    searchSchema,
    detailsSchema,
    fullDetailsSchema
});
