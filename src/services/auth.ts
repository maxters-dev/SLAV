import api from './api'

type AuthUser = {
    name: string;
    email: string;
    // eslint-disable-next-line camelcase
    api_token: string;
}

const TOKEN_NAME = 'ToKen_LoginName_Da_Zoeira'

export default {
  getToken (): string | null {
    return localStorage.getItem(TOKEN_NAME)
  },
  setToken (value: string) {
    localStorage.setItem(TOKEN_NAME, value)
    return this
  },
  removeToken (): void {
    localStorage.removeItem(TOKEN_NAME)
  },
  async getUser (): Promise<Record<string, any>> {
    return api.get('users/me')
  },
  logout (): void {
    this.removeToken()
  },

  async attempt (email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post('users/login', { email, password })
    return data as AuthUser
  },

  async login (email: string, password: string): Promise<AuthUser> {
    const authUser = await this.attempt(email, password)
    this.setToken(authUser.api_token)
    return authUser
  }
}
