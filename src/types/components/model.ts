import { FieldConfig } from '../schema';

export type FieldResult = {
    type: FieldConfig['type'];
    title: FieldConfig['name'];
    value: string | string[];
};
