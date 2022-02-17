import { RouteConfig, Location } from 'vue-router';
import { Component } from 'vue-router/types/router';
import Resource from '../services/resource';
import { Model } from './laravel';
import { FieldViewListSchema, FormSchema, InputSchema, SearchSchema } from './schema';

export type CrudRouteConfigCallback = (
    config: Record<string, any>
) => Record<string, any>;

export type BaseRouteProps = {
    pageTitle: string;
    resource: Resource;
};

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
    fields: FieldViewListSchema;
    searchSchema: SearchSchema[];
    actionNames: ResourceActionNames;
    pageTitle: string;
    itemTitleProp: string | ((value: any) => string);
    itemImageProp?: string | ((value: any) => string);
} & BaseRouteProps;

export type SidebarItemConfig = {
    title: string;
    to: Location;
};

export type ShowRouteProps = {
    fields: FieldViewListSchema;
} & BaseRouteProps;

export type Authorizations = {
    [key: string]: (model?: Model) => boolean
};

export type ResourceRouteConfig = {
    name: string;
    formSchema?: FormSchema;
    searchSchema?: SearchSchema;
    create?: ((props: FormRouteProps) => FormRouteProps) | false;
    edit?: ((props: FormRouteProps) => FormRouteProps) | false;
    index?: ((props: IndexRouteProps) => IndexRouteProps) | false;
    show?: ((props: ShowRouteProps) => ShowRouteProps) | false;
    remove?: boolean;
    propertyTitleValue?: string | ((value: any) => string);
    propertyImageValue?: string;
    singularTitle?: string;
    pluralTitle?: string;
    fullDetailsSchema?: FieldViewListSchema;
    detailsSchema?: FieldViewListSchema;
    handleAuthorizations?: (() => Promise<Authorizations>);
    customActions?: { [key: string]: Component}
    prefixName?: string;
    indexComponent?: Component;
    showComponent?: Component;
    formComponent?: Component;
    children?: Array;
};

export type EditRouteProps = FormRouteProps;
export type CreateRouteProps = EditRouteProps;

export type RouteConfigResourceDictionary = {
    show: RouteConfig;
    index: RouteConfig;
    create: RouteConfig;
    edit: RouteConfig;
};
