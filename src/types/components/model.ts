import { FieldViewSchema } from '../schema';

export type FieldResult = {
    type: FieldViewSchema['type'];
    title: FieldViewSchema['name'];
    value: string | string[];
};
