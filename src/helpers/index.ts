import { Model } from '../types/laravel';

export const titleCase = (value: string) => value;

export function setModelPropValue (model: Model, name: string, value: any) {
    const keys: string[] = name.split('.');
    let obj = model;

    while (keys.length - 1) {
        const key: any = keys.shift();

        if (!(key in obj)) {
            obj[key] = {};
        }

        obj = obj[key];
    }

    obj[keys[0]] = value;
}

export function getModelPropValue (model: Model, name: string) {
    let deepValue = model;

    name.split('.').forEach((key: string) => {
        deepValue = deepValue[key];
    });

    return deepValue;
}
