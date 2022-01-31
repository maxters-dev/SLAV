import slugify from 'slugify';
import { addTimestampsFields, dateTimeFormatter, yesOrNot } from '@/schemas/helpers';
import { createRouteResource } from '.';
import { IndexRouteProps } from '@/types/router';
import { InputSchema, InputSchemaProperties } from '@/types/schema';
import { uploadSingleFile } from '@/services/api';


const postSchemaForm: InputSchema[] = [
    {
        name: 'title',
        label: 'Título',
        listeners({ model: post }) {
            return {
                input(value: string): void {
                    const slug = slugify(value, { replacement: '-', lower: true, strict: false });
                    post.slug = slug
                }
            }
        }
    },
    {
        name: 'slug',
        label: 'Slug',
    },
    {
        name: 'posted_at',
        label: 'Data da Publicação',
        type: 'date',
    },
    {
        name: 'excerpt',
        label: 'Descrição',
        component: 'VTextarea',
        rows: 2
    },
    {
        name: 'is_draft',
        label: 'Rascunho',
        component: 'VSwitch'
    },
    {
        name: 'content',
        label: 'Conteúdo',
        component: () => import('@/components/AppRichTextEditor.vue'),
        listeners({ model }) {
            return {
                imageSelected(imageFile: File) {
                    console.log(imageFile)
                }
            }
        }
    },

    function cover({ model }): InputSchemaProperties {

        return {
            name: 'cover',
            label: 'Capa da Publicação',
            src: model.cover_url,
            component: () => import('@/components/AppImageUpload.vue'),
            listeners: {
                async imageSelected(imageFile: File) {
                    const data = await uploadSingleFile('posts/upload-cover', { file: imageFile, name: 'image' })
                    model.cover = data.path
                }
            }
        }
    }
]


const showFields = addTimestampsFields([
    { name: 'title', title: 'Título' },
    { name: 'cover_url', title: 'Capa da Publicação', type: 'image' },
    { name: 'excerpt', title: 'Descrição' },
    { name: 'user', title: 'Autor da Publicação', format: (user: Record<string, string>) => user ? user.name : '-' },
    { name: 'tags', title: 'Tags', format: (tags: Record<string, string>[]) => tags.map(tag => tag.name) },
    { name: 'views_count', title: 'Número de Visualizações' },
    { name: 'slug', title: 'Slug' },
    { name: 'is_draft', title: 'Rascunho', format: yesOrNot },
    { name: 'posted_at', title: 'Data de Publicação', format: dateTimeFormatter },
])


const indexFields = [
    { name: 'excerpt', title: 'Descrição', format: (value: string) => value || '-' },
    { name: 'is_draft', title: 'Rascunho', format: yesOrNot },
    { name: 'views_count', title: 'Número de Visualizações' },
    { name: 'user', title: 'Autor da Publicação', format: (user: Record<string, string>) => user ? user.name : '-' },
    { name: 'posted_at', title: 'Data de Publicação', format: dateTimeFormatter },
];

export default createRouteResource({
    name: 'posts',
    icon: 'mdi-web',
    formSchema: postSchemaForm,
    searchSchema: [
        { value: 'contains[title]', text: 'Título' },
        { value: 'contains[content]', text: 'Conteúdo' }
    ],
    index(props: IndexRouteProps) {
        return {
            ...props,
            itemTitleProp: 'title',
            itemImageProp: 'cover_url',
            fields: indexFields,
        };
    },

    show(props) {
        return {
            ...props,
            fields: showFields
        }
    }
})
