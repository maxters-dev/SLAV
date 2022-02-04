import api from './api';

const TOKEN_KEY = '@SlavToken@';

export type AuthUser = {
    // eslint-disable-next-line camelcase
    api_token: string;
} & Record<string, any>;

export interface AuthService {
    attempt(email: string, password: string): Promise<AuthUser>;
    getUser(): Promise<AuthUser>;
    login(email: string, password: string): Promise<AuthUser>;
    logout(): void;
    setToken(value: string): AuthService;
    getToken(): string | null;
    removeToken(): void;
}

const authSessionService: AuthService = {

    getToken (): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    },
    setToken (value: string) {
        sessionStorage.setItem(TOKEN_KEY, value);
        return this;
    },
    removeToken (): void {
        sessionStorage.removeItem(TOKEN_KEY);
    },
    async getUser (): Promise<AuthUser> {
        const { data } = await api.get('users/me');
        return data as AuthUser;
    },
    logout (): void {
        this.removeToken();
    },

    async attempt (email: string, password: string): Promise<any> {
        const { data } = await api.post('users/login', { email, password });
        return data as AuthUser;
    },

    async login (email: string, password: string): Promise<AuthUser> {
        const authUser = await this.attempt(email, password);
        this.setToken(authUser.api_token);
        return authUser;
    }
};

export default authSessionService;
