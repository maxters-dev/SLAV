import { Resource } from '../../../index';
import { Model } from '../../../src/types/laravel';
import { createRouteResource } from '../../../src/router-resource';
import { addTimestampsFields } from '../../../src/helpers/schema/ptBr';

const formSchema = [
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

            return products;
        }
    }
];

const fields = addTimestampsFields([
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
    index (props) {
        return {
            ...props,
            pageTitle: 'Categorias',
            itemTitleProp: (v) => v.name as string,
            fields: fields
        };
    }
});
