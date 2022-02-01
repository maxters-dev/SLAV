import Vue, { Component } from 'vue';
import { Model } from './laravel';

type InsideComponentParams = { model: Model; component: Vue };

export type SearchSchema = {
    value: string;
    text: string;
};

export type FieldViewSchema = {
    name: string;
    title: string;
    type?: string;
    format?: (value: any, model: Record<string, any>) => string | string[];
};

/**
 * @deprecated
 */
export type FieldConfig = FieldViewSchema;

export type InputSchemaProperties = {
    name: string;
    label: string;
    type?: string;
    component?: Component;
    listeners?:
        | ((props: InsideComponentParams) => Record<string, () => any>)
        | Record<string, () => any>;
    transformValue?: (value: any) => any;
} & Record<string, any>;

export type InputSchema =
    | InputSchemaProperties
    | ((config: InsideComponentParams) => InputSchemaProperties);
