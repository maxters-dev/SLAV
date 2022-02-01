import { kebabCase } from '@lukaspolak/kebab-case';
import ModelIndex from './views/ModelIndex.vue';
import ModelForm from './views/ModelForm.vue';
import ModelShow from './views/ModelShow.vue';
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

const createRouteResource = ({ formSchema, name, searchSchema, ...props }: ResourceRouteConfig): RouteConfigResourceDictionary => {
    const slug = kebabCase(name);
    const resource = new Resource(slug);
    const actionNames = generateNames(name);

    const resourceRoutes = {
        create: {
            path: `/${slug}/create`,
            component: ModelForm,
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
            component: ModelShow,
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
            component: ModelIndex,
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
            component: ModelForm,
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
};

const createRouteResources = (routeResources: ResourceRouteConfig[]) => {
    return routeResources.map(createRouteResource);
};

/**
 * Usado para gerar rotas a partir de um schema de cwrud definido {index, show, create, edit}
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
    });

    return routes;
};

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
            if (route?.meta?.disabled === true) continue;
            routes.push(route);
        }
    });

    return routes;
};

export {
    createRouteResources,
    generateRoutesFromResources,
    createRouteResource,
    generateFromRouteDictionaries
};
