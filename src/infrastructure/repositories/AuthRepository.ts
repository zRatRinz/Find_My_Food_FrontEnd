import { AuthResponse, AuthUser } from '@/domain/Auth';
import { IAuthRepository } from '@/domain/AuthRepository';
import { AuthDTO, AuthMapper } from '../dtos/AuthDTO';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthRepository implements IAuthRepository {
  async login(username: string, password: string): Promise<AuthResponse & { data: AuthUser }> {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }

  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
}
