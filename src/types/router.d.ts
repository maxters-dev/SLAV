import { RawLocation, RouteConfig } from 'vue-router'
import Resource from '../services/resource'
import { FieldConfig, InputSchema, SearchSchema } from './schema'

export type CrudRouteConfigCallback = (config: Record<string, any>) => Record<string, any>;

export type BaseRouteProps = {
    pageTitle: string;
    resource: Resource;
}

export type ResourceActionNames = {
    index: string;
    create: string;
    edit: string;
    show: string;
};

export type FormRouteProps = {
    formSchema: InputSchema[];
    indexRoute: ResourceActionNames['index'];
} & BaseRouteProps;

export type IndexRouteProps = {
    fields: FieldConfig[],
    searchSchema: SearchSchema[],
    actionNames: ResourceActionNames,
    pageTitle: string;
    itemTitleProp: string;
    itemImageProp?: string;
} & BaseRouteProps;

export type SidebarItemConfig = {
    title: string;
    icon: string;
    to: RawLocation
};

export type ShowRouteProps = {
    fields: FieldConfig[];
} & BaseRouteProps;

export type ResourceRouteConfig = {
    name: string;
    formSchema: InputSchema[];
    icon?: string;
    searchSchema?: SearchSchema[];
    create?: ((props: FormRouteProps) => FormRouteProps) | false;
    edit?: ((props: FormRouteProps) => FormRouteProps) | false;
    index?: ((props: IndexRouteProps) => IndexRouteProps) | false;
    show?: ((props: ShowRouteProps) => ShowRouteProps) | false;
}

export type EditRouteProps = FormRouteProps;
export type CreateRouteProps = EditRouteProps;

export type RouteConfigResourceDictionary = {
    show: RouteConfig;
    index: RouteConfig;
    create: RouteConfig;
    edit: RouteConfig;
}
