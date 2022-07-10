import Resource from '../services/resource';
import Vue, { PropType } from 'vue';
import { Model, Paginated } from '../types/laravel';
import { Authorizations, IndexRouteProps, ResourceActionNames, ResourceRouteConfig } from '../types/router';
import { SearchSchema } from '../types/schema';
import { getModelPropValue } from '../helpers';
import { NestedRouteResource, RouteResource } from '../route-resource';

function useStringOrCallback (
    model: Model,
    prop: ResourceRouteConfig['propertyTitleValue'] | ResourceRouteConfig['propertyImageValue']
): string | null {
    if (typeof prop === 'function') {
        return prop(model);
    } else if (typeof prop !== 'string') return null;

    const result = getModelPropValue(model, prop);

    return typeof result === 'string' ? result : null;
}

export const props = {
    resource: {
        type: Resource,
        required: true
    },

    pageTitle: {
        type: String,
        required: true
    },

    removeEnabled: {
        type: Boolean,
        default: true
    },

    actionNames: {
        type: Object as PropType<ResourceActionNames>,
        required: true
    },

    propertyTitleValue: {
        type: [String, Function] as PropType<ResourceRouteConfig['propertyTitleValue']>,
        default: 'name'
    },

    propertyImageValue: {
        type: [String, Function] as PropType<ResourceRouteConfig['propertyImageValue']>,
        default: null
    },

    fields: {
        type: [Array, Function] as PropType<IndexRouteProps['fields']>,
        required: true
    },

    searchSchema: {
        type: Array as PropType<SearchSchema>,
        default: () => []
    },

    handleAuthorizations: {
        type: Function as PropType<ResourceRouteConfig['handleAuthorizations']>,
        default: null
    },

    customActions: {
        type: Object as PropType<ResourceRouteConfig['customActions']>,
        default: () => ({})
    },

    isNested: Boolean,

    routeResource: RouteResource
};

export default Vue.extend({
    props,

    data () {
        return {
            models: { data: [] as Model[] } as Paginated,
            loading: { fetch: false },
            searchParams: {},
            actionsAuthorization: {} as Authorizations
        };
    },

    computed: {
        parentId (): number | null {
            const id = this.$route.params.parentId;
            return id ? parseInt(id, 10) : null;
        }
    },

    watch: {
        '$route.path': {
            immediate: true,
            handler () {
                this.startup();
            }
        }
    },

    methods: {
        async startup () {
            this.models = { last_page: 0, data: [] as Model[] } as Paginated;
            this.actionsAuthorization = {};

            if (this.handleAuthorizations) {
                this.actionsAuthorization = await this.handleAuthorizations();
            }

            this.searchParams = Object.fromEntries(this.searchSchema.map((search) => {
                return [search.name, search.defaultValue];
            }));

            this.paginate(1);
        },
        useImageAndTitle (model: Model) {
            return {
                title: useStringOrCallback(model, this.propertyTitleValue),
                image: useStringOrCallback(model, this.propertyImageValue)
            };
        },

        routeIsEnabled (actioName: string, routeName: string): boolean {
            if (typeof this.actionsAuthorization[actioName] === 'function') {
                return this.actionsAuthorization[actioName]();
            }

            const route = this.$router.match({ name: routeName });

            return route?.meta?.enabled === true;
        },

        async search (params: {[key: string]: any}) {
            this.searchParams = params;
            await this.paginate(1);
        },

        async _paginateNested (page: number) {
            const parentPath = (this.routeResource as NestedRouteResource).prefixPath;
            return this.resource.paginatedNested(this.parentId as number, parentPath, { page, ...this.searchParams });
        },

        async paginate (page: number) {
            this.loading.fetch = true;
            try {
                if (this.routeResource instanceof NestedRouteResource) {
                    this.models = await this._paginateNested(page);
                } else {
                    this.models = await this.resource.paginated({ page, ...this.searchParams });
                }
            } finally {
                this.loading.fetch = false;
            }
        },

        async remove (model: Model) {
            await this.resource.delete(model.id);
            const index = this.models.data.indexOf(model);
            this.models.data.splice(index, 1);
        }
    }
});
