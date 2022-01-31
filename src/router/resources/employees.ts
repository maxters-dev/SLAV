import { addTimestampsFields } from '@/schemas/helpers';
import { Model } from '@/types/laravel';
import { FieldConfig, InputSchema } from '@/types/schema';
import { createRouteResource } from '.';

const minimalFields: FieldConfig[] = [
    { name: 'position', title: 'Cargo' }
];

const fields: FieldConfig[] = addTimestampsFields([
    { name: 'image_url', title: 'Imagem', type: 'image' },
    { name: 'first_name', title: 'Nome' },
    { name: 'last_name', title: 'Sobrenome' },
    ...minimalFields,
]);

const formSchema: InputSchema[] = [
    { name: 'first_name', label: 'Nome' },
    { name: 'last_name', label: 'Sobrenome' },
    function image({ model }: { model: Model }) {
        return {
            label: 'Imagem',
            name: 'image',
            src: model.image_url,
            component: () => import('@/components/AppImageUpload.vue')
        };
    },
    { name: 'position', label: 'Cargo' },
    { name: 'skill', label: 'Especialista em:' },
    { name: 'phone', label: 'Telefone', type: 'tel' },
    { name: 'whatsapp', label: 'Whatsapp', type: 'tel' },
    { name: 'instagram', label: 'Instagram', type: 'url' },
    { name: 'linkedin', label: 'Linkein', type: 'url' },
    { name: 'order', label: 'Posição na Listagem', type: 'number' },
]

export default createRouteResource({
    name: 'employees',
    icon: 'mdi-account',
    searchSchema: [
        { text: 'Primeiro Nome', value: 'contains[first_name]' },
        { text: 'Cargo', value: 'contains[position]' }
    ],
    formSchema,
    index: (props) => ({
        ...props,
        itemImageProp: 'image_url',
        itemTitleProp: 'full_name',
        fields: minimalFields,
        pageTitle: 'Colaboradores'
    }),

    show: (props) => ({
        ...props,
        fields,
        pageTitle: 'Visualizando Colaborador'
    })
})
