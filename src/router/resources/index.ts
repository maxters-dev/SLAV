import { kebabCase } from '@lukaspolak/kebab-case';
import ModelList from '@/components/ModelList.vue';
import ModelForm from '@/components/ModelForm.vue';
import ModelShow from '@/components/ModelShow.vue'
import Resource from '../../services/resource';
import { addTimestampsFields } from '../../schemas/helpers';
import { RouteConfig } from 'vue-router';
import { IndexRouteProps, ResourceActionNames, ResourceRouteConfig, RouteConfigResourceDictionary, ShowRouteProps } from '@/types/router';
import store from '@/store';
import { titleCase } from '@/helpers';

const createActionNames = (name: string): ResourceActionNames => ({
    create: `${name}Create`,
    edit: `${name}Edit`,
    index: `${name}Index`,
    show: `${name}Show`,
});

const createRouteResource = ({ formSchema, name, searchSchema, ...props }: ResourceRouteConfig) => {

    const slug = kebabCase(name);
    const resource = new Resource(slug);
    const actionNames = createActionNames(name);


    const resourceRoutes = {
        create: {
            path: `/${slug}/create`,
            component: ModelForm,
            name: actionNames.create,
            props: {
                indexRoute: actionNames.index,
                formSchema,
                pageTitle: `Novo ${name.slice(0, -1)}`,
                resource,
            },
            meta: {
                disabled: props.create === false
            }
        },
        show: {
            path: `/${slug}/:id`,
            component: ModelShow,
            name: actionNames.show,
            props: {
                pageTitle: `Visualizando ${name.slice(0, -1)}`,
                resource,
                fields: addTimestampsFields([
                    { name: 'name', title: 'Nome' },
                ]) as ShowRouteProps['fields'],
            },
            meta: {
                disabled: props.show === false
            }
        },
        index: {
            path: `/${slug}`,
            component: ModelList,
            name: actionNames.index,
            props: {
                actionNames,
                fields: [] as IndexRouteProps['fields'],
                resource,
                pageTitle: titleCase(name),
                itemTitleProp: 'name',
                searchSchema,

            },
            meta: {
                disabled: props.index === false
            }
        },
        edit: {
            path: `/${slug}/:id/edit`,
            component: ModelForm,
            name: actionNames.edit,
            props: {
                formSchema,
                indexRoute: actionNames.index,
                pageTitle: `Editando ${name.slice(0, -1)}`,
                resource,
            },
            meta: {
                disabled: props.edit === false
            }
        }
    };

    type RouteResourceKey = keyof (typeof resourceRoutes);

    for (const key in resourceRoutes) {
        const callback = props[key as RouteResourceKey];
        if (typeof callback != 'function') continue;

        const route = resourceRoutes[key as RouteResourceKey]
        Object.assign(route.props, callback(route.props as any));
    }

    store.sidebarItems.push({
        title: titleCase(resourceRoutes.index.props.pageTitle),
        icon: props.icon || 'mdi-link',
        to: { name: actionNames.index }
    });


    return resourceRoutes;
}

const createRouteResources = (routeResources: ResourceRouteConfig[]) => {
    return routeResources.map(createRouteResource)
};

/**
 * Usado para gerar rotas a partir de um schema de crud definido {index, show, create, edit}
 *
 * @param routeDicionaries
 * @returns
 */
const generateFromRouteDictionaries = (routeDicionaries: RouteConfigResourceDictionary[]) => {

    const routes: RouteConfig[] = [];

    routeDicionaries.forEach((routeDicionary: RouteConfigResourceDictionary) => {

        for (const route of Object.values(routeDicionary)) {

            if (route?.meta?.disabled === true) continue;

            routes.push(route);
        }
    })

    return routes;
}

/**
 * Cria as rotas a partir de um array de configurações
 * @param routeResources
 *
 * @returns
 */
const generateRoutesFromResources = (routeResources: ResourceRouteConfig[]) => {

    const routes: RouteConfig[] = [];

    createRouteResources(routeResources).forEach((routeDicionary) => {

        for (const route of Object.values(routeDicionary)) {
            if (route.meta.disabled === true) continue;
            routes.push(route);
        }
    });

    return routes;
};

export {
    createRouteResources,
    generateRoutesFromResources,
    createRouteResource,
    generateFromRouteDictionaries,
}
