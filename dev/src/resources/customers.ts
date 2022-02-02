
import { Model } from '../../../src/types/laravel';
import { createRouteResource } from '../../../src/router-resource';
import { addTimestampsFields } from '../../../src/helpers/schema/ptBr';
import { InputSchema } from '../../../src/types/schema';

function formSchema (): InputSchema[] {
    return ([
        {
            name: 'full_name',
            label: 'Nome Completo'
        },
        {
            name: 'user.email',
            label: 'E-mail do usuário'
        },
        {
            name: 'description',
            label: 'Descrição'
        }
    ]);
}

const fields = addTimestampsFields([
    {
        name: 'full_name',
        title: 'Categoria'
    },
    {
        name: 'description',
        title: 'Descrição'
    }
]);

export default createRouteResource({
    name: 'customers',
    icon: 'mdi-tag',
    formSchema,
    show: false,
    index (props) {
        return {
            ...props,
            // itemTitleProp: 'full_name',
            itemTitleProp: (model: Model) => model.user.name,
            fields
        };
    }
});
