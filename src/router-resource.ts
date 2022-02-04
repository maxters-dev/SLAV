import { kebabCase } from '@lukaspolak/kebab-case';
import Resource from './services/resource';
import { RouteConfig } from 'vue-router';
import store from './store';
import {
    IndexRouteProps,
    ResourceActionNames,
    ResourceRouteConfig,
    RouteConfigResourceDictionary,
    ShowRouteProps
} from './types/router';

const generateNames = (name: string): ResourceActionNames => ({
    create: `${name}Create`,
    edit: `${name}Edit`,
    index: `${name}Index`,
    show: `${name}Show`
});

function createRouteResource ({ formSchema, name, searchSchema, ...props }: ResourceRouteConfig): RouteConfigResourceDictionary {
    const slug = kebabCase(name);
    const resource = new Resource(slug);
    const actionNames = generateNames(name);

    const resourceRoutes = {
        create: {
            path: `/${slug}/create`,
            component: () => import(/* webpackChunkName: "slav.create" */ './views/ModelForm.vue'),
            name: actionNames.create,
            props: {
                indexRoute: actionNames.index,
                formSchema,
                pageTitle: `Novo ${name.slice(0, -1)}`,
                resource
            },
            meta: {
                disabled: props.create === false
            }
        },
        show: {
            path: `/${slug}/:id`,
            component: () => import(/* webpackChunkName: "slav.show" */ './views/ModelShow.vue'),
            name: actionNames.show,
            props: {
                pageTitle: `Visualizando ${name.slice(0, -1)}`,
                resource,
                fields: [] as ShowRouteProps['fields']
            },
            meta: {
                disabled: props.show === false
            }
        },
        index: {
            path: `/${slug}`,
            component: () => import(/* webpackChunkName: "slav.index" */ './views/ModelIndex.vue'),
            name: actionNames.index,
            props: {
                actionNames,
                fields: [] as IndexRouteProps['fields'],
                resource,
                pageTitle: name,
                itemTitleProp: 'name',
                searchSchema
            },
            meta: {
                disabled: props.index === false
            }
        },
        edit: {
            path: `/${slug}/:id/edit`,
            component: () => import(/* webpackChunkName: "slav.edit" */ './views/ModelForm.vue'),
            name: actionNames.edit,
            props: {
                formSchema,
                indexRoute: actionNames.index,
                pageTitle: `Editando ${name.slice(0, -1)}`,
                resource
            },
            meta: {
                disabled: props.edit === false
            }
        }
    };

    type RouteResourceKey = keyof (typeof resourceRoutes);

    for (const key in resourceRoutes) {
        const callbackProps = props[key as RouteResourceKey];
        if (typeof callbackProps !== 'function') continue;
        const route = resourceRoutes[key as RouteResourceKey];
        const resultProps = callbackProps(route.props as any);
        Object.assign(route.props, resultProps);
    }

    store.sidebarItems.push({
        title: resourceRoutes.index.props.pageTitle,
        icon: props.icon || 'mdi-link',
        to: { name: actionNames.index }
    });

    return resourceRoutes;
}

function createRouteResources (routeResources: ResourceRouteConfig[]) {
    return routeResources.map(createRouteResource);
}

/**
 * Usado para gerar rotas a partir de um schema de cwrud definido {index, show, create, edit}
 *
 * @param routeDicionaries
 * @returns
 */
function generateFromRouteDictionaries (routeDicionaries: RouteConfigResourceDictionary[]) {
    const routes: RouteConfig[] = [];

    routeDicionaries.forEach((routeDicionary: RouteConfigResourceDictionary) => {
        for (const route of Object.values(routeDicionary)) {
            if (route?.meta?.disabled === true) { continue; }

            routes.push(route);
        }
    });

    return routes;
}

function generateRoutesFromResources (routeResources: ResourceRouteConfig[]) {
    const routes: RouteConfig[] = [];

    createRouteResources(routeResources).forEach((routeDicionary) => {
        for (const route of Object.values(routeDicionary)) {
            if (route?.meta?.disabled === true) { continue; }
            routes.push(route);
        }
    });

    return routes;
}

export {
    createRouteResources,
    generateRoutesFromResources,
    createRouteResource,
    generateFromRouteDictionaries
};
