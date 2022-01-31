import { Model, Paginated, Payload } from '@/types/laravel';
import api from './api'

class Resource
{
    prefix: string;

    constructor (prefix: string) {
        this.prefix = prefix;
    }

    async create(payload: Payload) {

        const { data } = await api.post(this.prefix, payload)

        return data;
    }

    /**
     *
     * @param {Number} id
     * @param {Object} payload
     * @returns {Object}
     */
    async update(id: number, payload: Payload) {

        const { data } = await api.put(`${this.prefix}/${id}`, payload)

        return data;
    }

    /**
     *
     * @param {Object} params
     * @returns
     */
    async paginated(params: Record<string, number|string>): Promise<Paginated>
    {
        const { data } = await api.get(`${this.prefix}`, { params: { page: 1, ...params } })

        return data as Paginated;
    }

    /**
     *
     * @param {Number} id
     * @returns {void}
     */
    async delete(id: number) {
        await api.delete(`${this.prefix}/${id}`)
    }

    /**
     *
     * @param {Object} payload
     * @returns
     */
    async show(id: number): Promise<Model> {

        const { data } = await api.get(`${this.prefix}/${id}`);

        return data as Model;
    }

    async all(): Promise<Paginated['data']> {
        const result = await this.paginated({})

        return result.data;
    }
}

export default Resource
