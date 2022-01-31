import { addTimestampsFields } from '@/schemas/helpers';
import Resource from '@/services/resource';
import { Model } from '@/types/laravel';
import { FieldConfig, InputSchema } from '@/types/schema'
import { createRouteResource } from '.'

const formSchema: InputSchema[] = [
    {
        name: 'name',
        label: 'Nome'
    },
    {
        name: 'slug',
        label: 'Slug'
    },
    {
        name: 'description',
        label: 'Descrição'
    },
    {
        name: 'products',
        label: 'Produtos',
        component: 'VAutocomplete',
        multiple: true,
        transformValue: (products: Model[]) => products.map(product => product.id),
        search: async (name: string) => {
            const { data: products } = await new Resource('products').paginated({
                'contains[name]': name
            });

            return products
        }
    }
]

const fields: FieldConfig[] = addTimestampsFields([
    {
        name: 'name',
        title: 'Categoria'
    },
    {
        name: 'description',
        title: 'Descrição'
    },
    {
        name: 'products_count',
        title: 'Quantidade de Produtos',
        format: (value: number) => (value || 0).toString().padStart(2, '0')
    }
]);

export default createRouteResource({
    name: 'categories',
    icon: 'mdi-tag',
    formSchema,
    show: false,
    index(props) {
        return {
            ...props,
            pageTitle: 'Categorias',
            fields: fields
        }
    }
})
