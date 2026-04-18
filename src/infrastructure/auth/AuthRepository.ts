import { AuthResponse, AuthUser } from '@/domain/auth/Auth';
import { IAuthRepository } from '@/domain/auth/AuthRepository';
import { AuthDTO, AuthMapper } from './AuthDTO';
import { APP_CONFIG } from '@/infrastructure/common/config';

export class AuthRepository implements IAuthRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async login(username: string, password: string): Promise<AuthResponse & { data: AuthUser }> {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Login failed: ${response.statusText}`);
      }

      const dto: AuthDTO = result;

      return {
        access_token: dto.access_token,
        token_type: dto.token_type,
        data: AuthMapper.toDomainUser(dto),
      };
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(APP_CONFIG.auth.tokenKey);
    localStorage.removeItem(APP_CONFIG.auth.userKey);
  }

  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
    return !!token;
  }
}
