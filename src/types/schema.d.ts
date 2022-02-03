import Vue, { Component, RenderContext } from 'vue';
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

export type InputSchemaProperties = {
    name: string;
    label?: string;
    type?: string;
    component?: Component | string;
    listeners?: ((config: InsideComponentParams) => RenderContext['listeners']) | RenderContext['listeners'];
    transformValue?: (value: any, model: Model) => any;
    defaultValue?: any;
} & Record<string, any>;

export type InputSchemaCallback = ((config: InsideComponentParams) => InputSchemaProperties);

export type InputSchema =
    | InputSchemaProperties
    | InputSchemaCallback;

export type FormSchema = InputSchema[] | ((config: InsideComponentParams) => InputSchema[])
