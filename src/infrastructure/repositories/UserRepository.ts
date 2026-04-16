import { User } from '@/domain/User';
import { IUserRepository } from '@/domain/UserRepository';
import { UserDTO, UserMapper } from '../dtos/UserDTO';

export class UserRepository implements IUserRepository {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getSimpleUserInfo(): Promise<User> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseUrl}/usersgetSimpleUserInfo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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
