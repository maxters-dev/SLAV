import { dateTimeFormatter } from '@/schemas/helpers';
import { Model } from '@/types/laravel';
import { IndexRouteProps, ShowRouteProps } from '@/types/router';
import { createRouteResource } from '.';

const minimalFields = [
    { name: 'subject', title: 'Assunto' },
    { name: 'email', title: 'E-mail' },
    { name: 'phone', title: 'Telefone' },
    { name: 'type', title: 'Tipo', format: (type: Model) => type?.name ?? '-' },
    { name: 'created_at', title: 'Data do Envio', format: dateTimeFormatter }
];

const fields = [
    { name: 'name', title: 'Nome Completo' },
    ...minimalFields,
    { name: 'message', title: 'Mensagem' },
];

export default createRouteResource({
    name: 'contacts',
    formSchema: [],
    icon: 'mdi-mail',
    searchSchema: [
        { text: 'Assunto', value: 'contains[subject]' },
        { text: 'Tipo de Contato', value: 'exact[contact_type_id]' }
    ],
    edit: false,
    create: false,
    index(props: IndexRouteProps): IndexRouteProps {
        return {
            ...props,
            fields: minimalFields,
            pageTitle: 'Contatos'
        }
    },
    show(props: ShowRouteProps): ShowRouteProps {
        return {
            ...props,
            pageTitle: 'Dados do Contato',
            fields
        }
    }
})
