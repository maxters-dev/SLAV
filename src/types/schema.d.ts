import Vue, { Component, RenderContext } from 'vue';
import { Model } from './laravel';

export type InsideComponentParams = { model: Model; component: Vue };

export type FieldViewSchema = {
    name: string;
    title: string;
    type?: 'image' | 'html' | 'progress' | 'rate';
    format?: (value: any, model: Record<string, any>) => string | string[] | number;
};

export type FieldViewListSchema = FieldViewSchema[] | ((config: InsideComponentParams) => FieldViewSchema[]);

export type InputSchemaProperties = {
    name: string;
    label?: string;
    type?: string;
    hidden?: boolean;
    component?: Component | string;
    listeners?: ((config: InsideComponentParams) => RenderContext['listeners']) | RenderContext['listeners'];
    transformValue?: (value: any, model: Model) => any;
    defaultValue?: any;
} & Record<string, any>;

export type InputSchemaCallback = ((config: InsideComponentParams) => InputSchemaProperties);

export type InputSchema =
    | InputSchemaProperties
    | InputSchemaCallback;

export type SearchSchema = InputSchemaProperties[]

export type FormSchema = InputSchema[] | ((config: InsideComponentParams) => InputSchema[])
