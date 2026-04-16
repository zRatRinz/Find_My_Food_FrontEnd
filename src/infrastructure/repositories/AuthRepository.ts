import { StandardResponse } from '../dtos/CommonDTO';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export class AuthRepository {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the 'message' field from the StandardResponse format
        throw new Error(data.message || `Login failed: ${response.statusText}`);
      }

      return data as LoginResponse;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}
