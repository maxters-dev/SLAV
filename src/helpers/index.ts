import { Model } from '../types/laravel';

export const titleCase = (word: string) =>
    word.replace(/\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

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

    try {
        name.split('.').forEach((key: string) => {
            deepValue = deepValue[key];
        });

        return deepValue;
    } catch {
        return '';
    }
}

export function numberMask (value: string, placeholder: string, character = '#'): string {
    let result = '';

    for (let i = 0, j = 0; i < placeholder.length; i++) {
        if (placeholder[i] === character) {
            result += value.charAt(j++);
        } else {
            result += placeholder.charAt(i);
        }
    }

    return result;
}
