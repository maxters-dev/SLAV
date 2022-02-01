import api from './api';

type AuthUser = {
  name: string;
  email: string;
  // eslint-disable-next-line camelcase
  api_token: string;
}

export default {

    tokenName: 'SlavToken',

    getToken (): string | null {
        return localStorage.getItem(this.tokenName);
    },
    setToken (value: string) {
        localStorage.setItem(this.tokenName, value);
        return this;
    },
    removeToken (): void {
        localStorage.removeItem(this.tokenName);
    },
    async getUser (): Promise<Record<string, any>> {
        return api.get('users/me');
    },
    logout (): void {
        this.removeToken();
    },

    async attempt (email: string, password: string): Promise<AuthUser> {
        const { data } = await api.post('users/login', { email, password });
        return data as AuthUser;
    },

    async login (email: string, password: string): Promise<AuthUser> {
        const authUser = await this.attempt(email, password);
        this.setToken(authUser.api_token);
        return authUser;
    }
};
