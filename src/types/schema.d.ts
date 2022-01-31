import Vue from 'vue'
import { Model } from './laravel'

type InsideComponentParams = { model: Model, component: Vue };

export type SearchSchema = {
    value: string;
    text: string;
}

export type FieldConfig = {
    name: string;
    title: string;
    type?: string;
    format?: (value: any, model: Record<string, any>) => string | string[];
}

export type InputSchemaProperties = {
    name: string;
    label: string;
    type?: string;
    component?: String | Function;
    listeners?: ((props: InsideComponentParams) => Record<string, Function>) | Record<string, Function>;
    transformValue?: ((value: any) => any)
} & Record<string, any>

export type InputSchema = InputSchemaProperties | ((config: InsideComponentParams) => InputSchemaProperties);
