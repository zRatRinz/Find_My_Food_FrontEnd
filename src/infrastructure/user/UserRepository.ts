import { User } from '@/domain/user/User';
import { IUserRepository } from '@/domain/user/UserRepository';
import { UserDTO, UserMapper } from './UserDTO';
import { APP_CONFIG } from '@/infrastructure/common/config';

export class UserRepository implements IUserRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async getSimpleUserInfo(): Promise<User> {
    const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseUrl}/usersgetSimpleUserInfo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status === 'success' && result.data) {
      const dto: UserDTO = result.data;
      return UserMapper.toDomain(dto);
    } else {
      throw new Error(result.message || 'Failed to fetch user information');
    }
  }
}
