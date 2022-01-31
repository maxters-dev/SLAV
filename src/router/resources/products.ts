import { addTimestampsFields } from '@/schemas/helpers';
import { Model } from '@/types/laravel';
import { FieldConfig, InputSchema } from '@/types/schema';
import { createRouteResource } from '.';

const minimalFields: FieldConfig[] = [
    { name: 'excerpt', title: 'Descrição' },
];

const fields: FieldConfig[] = addTimestampsFields([
    { name: 'image_url', title: 'Imagem', type: 'image' },
    { name: 'name', title: 'Nome do Produto' },
    ...minimalFields,

    { name: 'content', title: 'Conteúdo', type: 'html' },
    { name: 'categories', title: 'Categorias', format: (categories: Model[]) => categories.map(item => item.name) },
]);

const formSchema: InputSchema[] = [
    { name: 'name', label: 'Nome' },
    { name: 'excerpt', label: 'Descrição', rows: 3, component: 'VTextarea' },
    { name: 'content', label: 'Conteúdo', component: () => import('@/components/AppRichTextEditor.vue') }
]

export default createRouteResource({
    name: 'products',
    icon: 'mdi-cube-outline',
    formSchema,
    searchSchema: [
        { text: 'Nome do Produto', value: 'contains[name]' },
        { text: 'Descrição', value: 'contains[content]' }
    ],
    index(props) {
        return {
            ...props,
            itemImageProp: 'image_url',
            fields: minimalFields,
            pageTitle: 'Produtos',
        }
    },

    show: (props) => ({ ...props, pageTitle: 'Visualizando Produto', fields })
})
