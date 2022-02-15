import { Model, Paginated, Payload } from '../types/laravel';
import api from './api';

export default class Resource {
    prefix: string;

    constructor (prefix: string) {
        this.prefix = prefix;
    }

    async create (payload: Payload) {
        const { data } = await api.post(this.prefix, payload);

        return data;
    }

    async update (id: number, payload: Payload) {
        const { data } = await api.put(`${this.prefix}/${id}`, payload);

        return data;
    }

    async paginated (
        params: Record<string, number | string>
    ): Promise<Paginated> {
        const { data } = await api.get(`${this.prefix}`, {
            params: { page: 1, ...params }
        });

        return data as Paginated;
    }

    async delete (id: number) {
        await api.delete(`${this.prefix}/${id}`);
    }

    async show (id: number): Promise<Model> {
        const { data } = await api.get(`${this.prefix}/${id}`);

        return data as Model;
    }

    async all (params: Record<string, string> = {}): Promise<Paginated['data']> {
        const result = [];
        let page = 1;

        let paginated;
        do {
            paginated = await this.paginated({ page, ...params });
            page++;
            result.push(...paginated.data);
        } while (paginated.data.length > 0);

        return result;
    }
}
