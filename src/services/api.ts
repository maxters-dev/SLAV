import { UnprocessableEntity } from '@/types/laravel';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import auth from './auth'
import { EventBus } from './event-bus';

const api = axios.create({
    baseURL: process.env.VUE_SLAV_API_BASE || 'https://maxters.dev/api/',
    headers: { Accept: 'application/json' },
});

const requestConfig = (config: AxiosRequestConfig) => {

    const token = auth.getToken();

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

const onErrorInterceptor = (err: AxiosError) => {

    const status: number = err.response?.status || 500

    if (err.response?.data instanceof Blob || !err.response?.data) {
        return Promise.reject(err)
    }

    const data = err.response?.data as Record<string, any>;

    if (401 === status) {
        auth.removeToken();
    } else if (422 === status && data) {
        const errors: UnprocessableEntity = (data?.errors || {});
        const message = Object.values(errors)[0][0];
        EventBus.$emit('$toast', message)
    }

    else if (400 === status && data.message) {
        EventBus.$emit('$toast', data.message)
    }

    return Promise.reject(err);
};

api.interceptors.request.use(requestConfig);
api.interceptors.response.use((res) => res, onErrorInterceptor);

export async function uploadSingleFile(path: string, { name, file }: { name: string, file: File }): Promise<Record<string, any>> {
    const formData = new FormData()
    formData.append(name, file, file.name);
    const { data } = await api.post(path, formData);
    return data as Record<string, any>;
}

export default api;
