
import { createRouteResource } from '../../../src/router-resource';
import { addTimestampsFields } from '../../../src/helpers/schema/ptBr';
import { FieldViewSchema, FormSchema } from '../../../src/types/schema';

const minimalFields: FieldViewSchema[] = [
    { title: 'Celular', name: 'phone' },
    { title: 'E-mail', name: 'user.email' }
];

const fields: FieldViewSchema[] = addTimestampsFields([
    { title: 'Nome Completo', name: 'user.name' },
    ...minimalFields,
    { title: 'Endereço', name: 'address' }
]);

const formSchema: FormSchema = () => ([
    { name: 'user.name', label: 'Nome' },
    {
        name: 'gender',
        label: 'Gênero',
        component: 'VSelect',
        itemValue: 'value',
        multiple: false,
        itemText: 'text',
        items: [{ text: 'Masculino', value: 'M' }, { text: 'Feminino', value: 'F' }]
    },
    { name: 'cpf', label: 'CPF', maxlength: 11, mask: '###.###.###-##', type: 'tel' },
    { name: 'birth_date', label: 'Data de Nascimento', type: 'date', component: 'AppDatePicker' },
    { name: 'user.email', label: 'E-mail' },
    { name: 'phone', label: 'Celular', counter: 11, maxlength: 11, type: 'tel', appendIcon: 'mdi-phone' },
    { name: 'address', label: 'Endereço', appendIcon: 'mdi-map' }
]);

export default createRouteResource({
    name: 'customers',
    icon: 'mdi-account',
    formSchema,
    searchSchema: [
        { value: 'contains[user.name]', text: 'Nome' }
    ],
    index: (props) => ({
        ...props,
        pageTitle: 'Clientes',
        itemTitleProp: 'user.name',
        fields: minimalFields
    }),
    show: (props) => ({
        ...props,
        fields,
        pageTitle: 'Informações do Cliente'
    }),
    create: props => ({ ...props, pageTitle: 'Cadastrar Cliente' })
});
