import api from './api';

const TOKEN_KEY = '@SlavToken@';

export type AuthUser = {
    // eslint-disable-next-line camelcase
    api_token: string;
} & Record<string, any>;

let cachedUser: AuthUser|null = null;

export interface AuthService {
    attempt(email: string, password: string): Promise<AuthUser>;
    getUser(enableCache: boolean): Promise<AuthUser>;
    login(email: string, password: string): Promise<AuthUser>;
    logout(): void;
    setToken(value: string): AuthService;
    getToken(): string | null;
    removeToken(): void;
}

export const authSessionService: AuthService & { tokenKey: string, loginEndpoint: string, loggedUserEndpoint: string } = {

    tokenKey: TOKEN_KEY,

    loginEndpoint: 'users/login',

    loggedUserEndpoint: 'users/me',

    getToken (): string | null {
        return localStorage.getItem(this.tokenKey);
    },

    setToken (value: string) {
        localStorage.setItem(this.tokenKey, value);
        return this;
    },

    removeToken (): void {
        localStorage.removeItem(this.tokenKey);
    },

    async getUser (enableCache = false): Promise<AuthUser> {
        if (enableCache === true && cachedUser) {
            return cachedUser;
        }
        const { data } = await api.get(this.loggedUserEndpoint);
        cachedUser = data as AuthUser;
        setTimeout(() => { cachedUser = null; }, 1000 * 60 * 5);
        return cachedUser;
    },

    logout (): void {
        this.removeToken();
    },

    async attempt (email: string, password: string): Promise<AuthUser> {
        const { data } = await api.post(this.loginEndpoint, { email, password });
        return data as AuthUser;
    },

    async login (email: string, password: string): Promise<AuthUser> {
        const authUser = await this.attempt(email, password);
        this.setToken(authUser.api_token);
        return authUser;
    }
};

export default authSessionService;
