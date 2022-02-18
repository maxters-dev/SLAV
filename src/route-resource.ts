import { kebabCase } from '@lukaspolak/kebab-case';
import Resource from './services/resource';
import { RouteConfig } from 'vue-router';
import store from './store';
import { titleCase } from './helpers';
import { genderOfWord } from './helpers/schema/ptBr';
import { FormSchema } from './types';
import {
    IndexRouteProps,
    ResourceRouteConfig,
    RouteConfigResourceDictionary,
    ShowRouteProps
} from './types/router';

class RouteResource {
    props: ResourceRouteConfig;
    resource: Resource;
    actionNames: { [key: string]: string };
    slug: string;

    constructor (props: ResourceRouteConfig) {
        this.props = props;
        this.slug = kebabCase(this.props.name);
        this.resource = new Resource(this.slug);
        this.actionNames = this.generateRouteNames();
    }

    get pageIndexTitle (): string {
        return this.props.pluralTitle ?? titleCase(this.slug.replace(/-/g, ' '));
    }

    get pageCreateTitle (): string {
        return `Cadastrar ${this.props.singularTitle ? this.props.singularTitle : ''}`;
    }

    get pageEditTitle (): string {
        return `Editando ${this.props.singularTitle ?? this.props.singularTitle}`;
    }

    get pageShowTitle (): string {
        return this.props.singularTitle
            ? `Detalhes ${genderOfWord(this.props.singularTitle) === 'f' ? 'da' : 'do'} ${this.props.singularTitle}`
            : 'Detalhes';
    }

    protected generateRouteNames () {
        const prefix = this.props.prefixName;
        const name = this.props.name;

        return {
            create: `${prefix}${name}Create`,
            edit: `${prefix}${name}Edit`,
            index: `${prefix}${name}Index`,
            show: `${prefix}${name}Show`
        };
    }

    get formSchema (): FormSchema {
        return this.props.formSchema ?? [];
    }

    get fullDetailsSchema (): ShowRouteProps['fields'] {
        return this.props.fullDetailsSchema ?? [];
    }

    get detailsSchema (): IndexRouteProps['fields'] {
        return this.props.detailsSchema ?? this.props.fullDetailsSchema ?? [];
    }

    get indexComponent () {
        return this.props.indexComponent ?? (() => import('./views/ModelIndex.vue'));
    }

    get formComponent () {
        return this.props.formComponent ?? (() => import('./views/ModelForm.vue'));
    }

    get showComponent () {
        return this.props.showComponent ?? (() => import('./views/ModelShow.vue'));
    }

    get propertyTitleValue (): ResourceRouteConfig['propertyTitleValue'] {
        return this.props.propertyTitleValue ?? 'name';
    }

    get propertyPageShowTitle (): string {
        return this.props.singularTitle
            ? `Detalhes ${genderOfWord(this.props.singularTitle) === 'f' ? 'da' : 'do'} ${this.props.singularTitle}`
            : 'Detalhes';
    }

    getShowRoute (): RouteConfig {
        return {
            path: `${this.slug}/:id`,
            component: this.showComponent,
            name: this.actionNames.show,
            props: {
                propertyTitleValue: this.propertyTitleValue,
                pageTitle: this.propertyPageShowTitle,
                resource: this.resource,
                fields: this.fullDetailsSchema
            },
            meta: { enabled: this.props.show !== false }
        };
    }

    getCreateRoute (): RouteConfig {
        return {
            path: `${this.slug}/create`,
            component: this.props.formComponent ?? (() => import('./views/ModelForm.vue')),
            name: this.actionNames.create,
            props: {
                indexRoute: this.actionNames.index,
                formSchema: this.formSchema,
                pageTitle: this.pageIndexTitle,
                resource: this.resource
            },
            meta: { enabled: this.props.create !== false }
        };
    }

    getEditRoute (): RouteConfig {
        return {
            path: `${this.slug}/:id/edit`,
            component: this.formComponent,
            name: this.actionNames.edit,
            props: {
                formSchema: this.formSchema,
                indexRoute: this.actionNames.index,
                pageTitle: this.pageEditTitle,
                resource: this.resource
            },
            meta: { enabled: this.props.edit !== false }
        };
    }

    getIndexRoute (): RouteConfig {
        return {
            path: this.slug,
            component: this.indexComponent,
            name: this.actionNames.index,
            props: {
                actionNames: this.actionNames,
                customActions: this.props.customActions,
                handleAuthorizations: this.props.handleAuthorizations,
                fields: this.detailsSchema,
                resource: this.resource,
                pageTitle: this.pageIndexTitle,
                propertyTitleValue: this.propertyTitleValue,
                searchSchema: this.props.searchSchema ?? [],
                propertyImageValue: this.props.propertyImageValue
            },
            meta: {
                enabled: true,
                enableRemove: this.props.remove ?? true
            }

        };
    }

    protected prepareProps (dictionary: RouteConfigResourceDictionary) {
        type K = 'index' | 'show' | 'create' | 'edit';

        Object.entries(dictionary).forEach(([key, route]) => {
            const index = key as K;
            if (key in this.props && typeof (this.props[index]) === 'function') {
                Object.assign(route.props, (this.props[index] as any)(route.props));
            }
        });
    }

    public toDictionary (): RouteConfigResourceDictionary {
        const dictionary = {
            index: this.getIndexRoute(),
            show: this.getShowRoute(),
            create: this.getCreateRoute(),
            edit: this.getEditRoute()
        };

        this.prepareProps(dictionary);

        dictionary.index.meta?.enabled && store.sidebarItems.push({
            title: this.pageIndexTitle,
            to: {
                name: this.actionNames.index
            }
        });

        return dictionary;
    }
}

class RouterRegistrar {
    public static toRoutes (resources: RouteResource[]): RouteConfig[] {
        const routes = [];

        for (const resource of Object.values(resources)) {
            routes.push(...Object.values(resource.toDictionary()));
        }

        return routes;
    }
}

function createRouteResource (config: ResourceRouteConfig): RouteConfigResourceDictionary {
    return new RouteResource(config).toDictionary();
}

export {
    createRouteResource,
    RouteResource,
    RouterRegistrar
};
