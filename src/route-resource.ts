import ActionButton from './components/ActionButton.vue';
import store from './store';
import Resource from './services/resource';
import { kebabCase } from '@lukaspolak/kebab-case';
import { RouteConfig } from 'vue-router';
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
    // eslint-disable-next-line no-use-before-define
    public readonly nesteds: NestedRouteResource[] = [];
    public readonly props: ResourceRouteConfig;
    public readonly resource: Resource;
    public readonly actionNames: { [key: string]: string };
    public readonly slug: string;

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
        return `Cadastrar ${this.props.singularTitle ?? ''}`;
    }

    get pageEditTitle (): string {
        return `Editando ${this.props.singularTitle ?? ''}`;
    }

    get pageShowTitle (): string {
        return this.props.singularTitle
            ? `Detalhes ${genderOfWord(this.props.singularTitle) === 'f' ? 'da' : 'do'} ${this.props.singularTitle}`
            : 'Detalhes';
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

    public get indexPath () {
        return this.buildRoutePath('');
    }

    get customActions () {
        const actions = Object.fromEntries(this.nesteds.map(nested => {
            return [
                nested.props.name,
                ActionButton.extend({
                    props: {
                        icon: { default: nested.icon },
                        routeName: { default: nested.actionNames.index }
                    }
                })
            ];
        }));

        return Object.assign(actions, this.props.customActions);
    }

    protected generateRouteNames () {
        const prefix = this.props.prefixName ?? '';
        const name = this.props.name;

        return {
            create: `${prefix}${name}Create`,
            index: `${prefix}${name}Index`,
            show: `${prefix}${name}Show`,
            edit: `${prefix}${name}Edit`
        };
    }

    public buildRoutePath (path = ''): string {
        return `${this.slug}/${path}`;
    }

    public getShowRoute (): RouteConfig {
        return {
            path: this.buildRoutePath(':id'),
            component: this.showComponent,
            name: this.actionNames.show,
            props: {
                propertyTitleValue: this.propertyTitleValue,
                pageTitle: this.pageShowTitle,
                resource: this.resource,
                fields: this.fullDetailsSchema
            },
            meta: { enabled: this.props.show !== false }
        };
    }

    public getCreateRoute (): RouteConfig {
        return {
            path: this.buildRoutePath('create'),
            component: this.props.formComponent ?? (() => import('./views/ModelForm.vue')),
            name: this.actionNames.create,
            props: {
                indexRoute: this.actionNames.index,
                formSchema: this.formSchema,
                pageTitle: this.pageCreateTitle,
                resource: this.resource,
                hasUpload: this.props.hasUpload
            },
            meta: { enabled: this.props.create !== false }
        };
    }

    public getEditRoute (): RouteConfig {
        return {
            path: this.buildRoutePath(':id/edit'),
            component: this.formComponent,
            name: this.actionNames.edit,
            props: {
                formSchema: this.formSchema,
                indexRoute: this.actionNames.index,
                pageTitle: this.pageEditTitle,
                resource: this.resource,
                hasUpload: this.props.hasUpload
            },
            meta: { enabled: this.props.edit !== false }
        };
    }

    public getIndexRoute (): RouteConfig {
        return {
            path: this.indexPath,
            component: this.indexComponent,
            name: this.actionNames.index,
            props: {
                actionNames: this.actionNames,
                customActions: this.customActions,
                handleAuthorizations: this.props.handleAuthorizations,
                fields: this.detailsSchema,
                resource: this.resource,
                pageTitle: this.pageIndexTitle,
                propertyTitleValue: this.propertyTitleValue,
                searchSchema: this.props.searchSchema ?? [],
                propertyImageValue: this.props.propertyImageValue,
                routeResource: this
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
            create: this.getCreateRoute(),
            show: this.getShowRoute(),
            edit: this.getEditRoute()
        };

        this.prepareProps(dictionary);

        return dictionary;
    }

    addNested (icon: string, props: ResourceRouteConfig) {
        const nested = new NestedRouteResource(this.slug, icon, props);
        this.nesteds.push(nested);
        return nested;
    }
}

class NestedRouteResource extends RouteResource {
    public readonly prefixPath: string;
    public readonly icon: string;

    constructor (path: string, icon: string, props: ResourceRouteConfig) {
        super(props);
        this.prefixPath = path;
        this.icon = icon;
    }

    public buildRoutePath (path?: string): string {
        return [this.prefixPath, ':parentId', this.slug, path].join('/');
    }

    addNested (icon: string, props: ResourceRouteConfig) {
        const nested = new NestedRouteResource(this.slug, icon, props);
        this.nesteds.push(nested);
        return nested;
    }
}

class RouterRegistrar {
    protected static pushLinks (routeResource: RouteResource) {
        if (routeResource instanceof NestedRouteResource) return;

        store.indexRoutes.push({
            title: routeResource.pageIndexTitle,
            to: {
                name: routeResource.actionNames.index
            }
        });
    }

    public static toRoutes (resources: RouteResource[]): RouteConfig[] {
        const routes = [];
        for (const resource of Object.values(resources)) {
            this.pushLinks(resource);
            routes.push(...this.toRoutes(resource.nesteds));
            routes.push(...Object.values(resource.toDictionary()));
        }
        return routes;
    }
}

export {
    RouteResource,
    NestedRouteResource,
    RouterRegistrar
};
