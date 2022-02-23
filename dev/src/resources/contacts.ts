import { RouteResource } from '../../..';
import { numberMask } from '../../../src/helpers';
import { yesOrNot } from '../../../src/helpers/schema/ptBr';
import { FieldViewSchema } from '../../../src/types';

const detailsSchema = [
    { name: 'email', title: 'E-mail' },
    { name: 'phone', title: 'Telefone', format: (value: string) => numberMask(value, '(##) #####-####') }
];

function fullDetailsSchema ({ model }) {
    const schema: FieldViewSchema[] = [...detailsSchema];

    if (model.contact_type_id === 4) {
        schema.push({
            name: 'metadata.oab',
            title: 'OAB',
            format: value => value || '-'
        });
    } else if (model.contact_type_id === 3) {
        schema.push({
            name: 'metadata.ja_investe_previdencia',
            title: 'Já Investe em Previdência?',
            format: yesOrNot
        });
    }

    return schema;
}

export default new RouteResource({
    name: 'Contacts',
    detailsSchema,
    edit: false,
    create: false,
    fullDetailsSchema
});
