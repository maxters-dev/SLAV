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
import { titleCase } from './helpers';
import { genderOfWord } from './helpers/schema/ptBr';

const generateNames = (name: string): ResourceActionNames => ({
    create: `${name}Create`,
    edit: `${name}Edit`,
    index: `${name}Index`,
    show: `${name}Show`
});

function createRouteResource (
    { formSchema = [], name, searchSchema, ...props }: ResourceRouteConfig
): RouteConfigResourceDictionary {
    const slug = kebabCase(name);
    const resource = new Resource(slug);
    const actionNames = generateNames(name);
    const propertyTitleValue = props.propertyTitleValue ?? 'name';
    const indexPageTitle = props.pluralTitle ?? titleCase(slug.replace(/-/g, ' '));
    const pageCreateTitle = `Cadastrar ${props.singularTitle ? props.singularTitle : ''}`;
    const pageShowTitle = props.singularTitle
        ? `Detalhes ${genderOfWord(props.singularTitle) === 'f' ? 'da' : 'do'} ${props.singularTitle}`
        : 'Detalhes';

    const resourceRoutes = {
        create: {
            path: `${slug}/create`,
            component: () => import('./views/ModelForm.vue'),
            name: actionNames.create,
            props: {
                indexRoute: actionNames.index,
                formSchema,
                pageTitle: pageCreateTitle,
                resource
            },
            meta: { enabled: props.create !== false }
        },
        show: {
            path: `${slug}/:id`,
            component: () => import('./views/ModelShow.vue'),
            name: actionNames.show,
            props: {
                propertyTitleValue,
                pageTitle: pageShowTitle,
                resource,
                fields: props.fullDetailsSchema ?? [] as ShowRouteProps['fields']
            },
            meta: { enabled: props.show !== false }
        },
        index: {
            path: `${slug}`,
            component: () => import('./views/ModelIndex.vue'),
            name: actionNames.index,
            props: {
                actionNames,
                fields: props.detailsSchema ?? props.fullDetailsSchema ?? [] as IndexRouteProps['fields'],
                resource,
                pageTitle: indexPageTitle,
                propertyTitleValue,
                searchSchema,
                handleAuthorizations: props.handleAuthorizations,
                customActions: props.customActions
            },
            meta: {
                enabled: true,
                enableRemove: props.remove ?? true
            }
        },
        edit: {
            path: `${slug}/:id/edit`,
            component: () => import('./views/ModelForm.vue'),
            name: actionNames.edit,
            props: {
                formSchema,
                indexRoute: actionNames.index,
                pageTitle: `Editando ${props.singularTitle || name}`,
                resource
            },
            meta: { enabled: props.edit !== false }
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
        to: {
            name: actionNames.index
        }
    });

    return resourceRoutes;
}

function createRouteResources (routeResources: ResourceRouteConfig[]) {
    return routeResources.map(createRouteResource);
}

function generateFromRouteDictionaries (routeDicionaries: RouteConfigResourceDictionary[]) {
    const routes: RouteConfig[] = [];

    routeDicionaries.forEach((routeDicionary: RouteConfigResourceDictionary) => {
        for (const route of Object.values(routeDicionary)) {
            routes.push(route);
        }
    });

    return routes;
}

function generateRoutesFromResources (routeResources: ResourceRouteConfig[]) {
    const routes: RouteConfig[] = [];

    createRouteResources(routeResources).forEach((routeDicionary) => {
        for (const route of Object.values(routeDicionary)) {
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
