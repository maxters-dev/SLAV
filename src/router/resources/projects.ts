import { addTimestampsFields } from '@/schemas/helpers'
import { FieldConfig, InputSchema } from '@/types/schema'
import { createRouteResource } from '@/router/resources'

export const formSchema: InputSchema[] = [
    {
        name: 'name',
        label: 'Nome',
    },

    {
        name: 'link',
        label: 'Link',
        type: 'url',
    },

    {
        name: 'description',
        label: 'Descrição',
        component: 'VTextarea',
        rows: 2
    },
]

export const showFields: FieldConfig[] = addTimestampsFields([
    {
        name: 'name',
        title: 'Nome do Projeto'
    },
    {
        name: 'description',
        title: 'Descrição'
    },
    {
        name: 'link',
        title: 'Link do Projeto'
    }
]);

const indexFields: FieldConfig[] = addTimestampsFields([
    { name: 'description', title: 'Descrição' }
])

export default createRouteResource({
    name: 'projects',
    formSchema,
    index (props) {
        return {
            ...props,
            pageTitle: 'Projetos',
            fields: indexFields,
        }
    },
    show (props) {
        return { ...props, fields: showFields};
    }
})
