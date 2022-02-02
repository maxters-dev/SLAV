import { Model } from '@/types/laravel';

export const titleCase = (value: string) => value;

export function setModelPropValue (model: Model, name: string, value: any) {
    let deepValue = model;
    const names: string[] = name.split('.');
    const targetProp = names.pop() as string;

    names.forEach((key: string) => {
        deepValue = deepValue[key] as Model;
    });

    deepValue[targetProp] = value;
}

export function getModelPropValue (model: Model, name: string) {
    let deepValue = model;

    name.split('.').forEach((key: string) => {
        deepValue = deepValue[key];
    });

    return deepValue;
}
